<?php

use App\Enums\UserRole;
use App\Models\Business;
use App\Models\Employee;
use App\Models\Service;
use App\Models\User;

test('owner can list services', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست',
        'slug' => 'test-salon-services',
    ]);

    Service::create([
        'business_id' => $business->id,
        'name' => 'کوتاهی مو',
        'duration_minutes' => 30,
        'price' => 250000,
    ]);

    $response = $this->actingAs($owner)->getJson("/api/admin/businesses/{$business->id}/services");

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

test('owner can create a service', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست',
        'slug' => 'test-salon-create-service',
    ]);

    $response = $this->actingAs($owner)->postJson("/api/admin/businesses/{$business->id}/services", [
        'name' => 'رنگ مو',
        'duration_minutes' => 60,
        'price' => 500000,
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('service.name', 'رنگ مو');

    $this->assertDatabaseHas('services', [
        'business_id' => $business->id,
        'name' => 'رنگ مو',
    ]);
});

test('employee cannot create services', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $employeeUser = User::factory()->create(['role' => UserRole::Employee]);
    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست',
        'slug' => 'test-salon-employee-no-service',
    ]);

    $employee = Employee::create([
        'business_id' => $business->id,
        'user_id' => $employeeUser->id,
    ]);

    $response = $this->actingAs($employeeUser)->postJson("/api/admin/businesses/{$business->id}/services", [
        'name' => 'خدمت غیرمجاز',
        'duration_minutes' => 30,
        'price' => 100000,
    ]);

    $response->assertStatus(403);
});

test('owner can list employees', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $employeeUser = User::factory()->create(['role' => UserRole::Employee]);
    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست',
        'slug' => 'test-salon-list-employees',
    ]);

    Employee::create([
        'business_id' => $business->id,
        'user_id' => $employeeUser->id,
    ]);

    $response = $this->actingAs($owner)->getJson("/api/admin/businesses/{$business->id}/employees");

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

test('owner can update business settings', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست',
        'slug' => 'test-salon-settings',
    ]);

    $response = $this->actingAs($owner)->putJson("/api/admin/businesses/{$business->id}/settings", [
        'name' => 'سالن به‌روز',
        'description' => 'توضیحات جدید',
    ]);

    $response->assertOk()
        ->assertJsonPath('business.name', 'سالن به‌روز');

    $this->assertDatabaseHas('businesses', [
        'id' => $business->id,
        'name' => 'سالن به‌روز',
    ]);
});

test('dashboard returns stats', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست',
        'slug' => 'test-salon-dashboard',
    ]);

    $response = $this->actingAs($owner)->getJson("/api/admin/businesses/{$business->id}/dashboard");

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                'total_appointments',
                'monthly_revenue',
                'new_customers',
                'service_distribution',
                'revenue_trend',
                'recent_appointments',
            ],
        ]);
});
