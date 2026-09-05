<?php

use App\Enums\UserRole;
use App\Models\Business;
use App\Models\Employee;
use App\Models\Service;
use App\Models\User;
use App\Models\WorkingHour;

test('customer can book an appointment', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $employeeUser = User::factory()->create(['role' => UserRole::Employee]);
    $customer = User::factory()->create(['role' => UserRole::Customer]);

    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست',
        'slug' => 'test-salon-booking',
        'is_active' => true,
    ]);

    $service = Service::create([
        'business_id' => $business->id,
        'name' => 'کوتاهی مو',
        'duration_minutes' => 30,
        'price' => 250000,
        'is_active' => true,
    ]);

    $employee = Employee::create([
        'business_id' => $business->id,
        'user_id' => $employeeUser->id,
        'is_active' => true,
    ]);

    $employee->services()->attach($service->id);

    WorkingHour::create([
        'employee_id' => $employee->id,
        'day_of_week' => now()->addDay()->dayOfWeek,
        'start_time' => '09:00',
        'end_time' => '18:00',
        'is_day_off' => false,
    ]);

    $response = $this->actingAs($customer)->postJson('/api/booking/appointments', [
        'employee_id' => $employee->id,
        'service_id' => $service->id,
        'date' => now()->addDay()->format('Y-m-d'),
        'start_time' => '10:00',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['appointment' => ['id', 'code', 'status']]);

    $this->assertDatabaseHas('appointments', [
        'business_id' => $business->id,
        'customer_id' => $customer->id,
        'status' => 'pending',
    ]);
});

test('customer cannot book overlapping slot', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $employeeUser = User::factory()->create(['role' => UserRole::Employee]);
    $customerA = User::factory()->create(['role' => UserRole::Customer]);
    $customerB = User::factory()->create(['role' => UserRole::Customer]);

    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست ۲',
        'slug' => 'test-salon-overlap',
        'is_active' => true,
    ]);

    $service = Service::create([
        'business_id' => $business->id,
        'name' => 'اصلاح',
        'duration_minutes' => 45,
        'price' => 150000,
        'is_active' => true,
    ]);

    $employee = Employee::create([
        'business_id' => $business->id,
        'user_id' => $employeeUser->id,
        'is_active' => true,
    ]);

    $employee->services()->attach($service->id);

    WorkingHour::create([
        'employee_id' => $employee->id,
        'day_of_week' => now()->addDay()->dayOfWeek,
        'start_time' => '09:00',
        'end_time' => '18:00',
        'is_day_off' => false,
    ]);

    $date = now()->addDay()->format('Y-m-d');

    $this->actingAs($customerA)->postJson('/api/booking/appointments', [
        'employee_id' => $employee->id,
        'service_id' => $service->id,
        'date' => $date,
        'start_time' => '10:00',
    ])->assertStatus(201);

    $this->actingAs($customerB)->postJson('/api/booking/appointments', [
        'employee_id' => $employee->id,
        'service_id' => $service->id,
        'date' => $date,
        'start_time' => '10:20',
    ])->assertStatus(409);
});

test('customer can cancel their appointment', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $employeeUser = User::factory()->create(['role' => UserRole::Employee]);
    $customer = User::factory()->create(['role' => UserRole::Customer]);

    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست ۳',
        'slug' => 'test-salon-cancel',
        'is_active' => true,
    ]);

    $service = Service::create([
        'business_id' => $business->id,
        'name' => 'خدمت',
        'duration_minutes' => 30,
        'price' => 100000,
        'is_active' => true,
    ]);

    $employee = Employee::create([
        'business_id' => $business->id,
        'user_id' => $employeeUser->id,
        'is_active' => true,
    ]);

    $employee->services()->attach($service->id);

    WorkingHour::create([
        'employee_id' => $employee->id,
        'day_of_week' => now()->addDay()->dayOfWeek,
        'start_time' => '09:00',
        'end_time' => '18:00',
        'is_day_off' => false,
    ]);

    $response = $this->actingAs($customer)->postJson('/api/booking/appointments', [
        'employee_id' => $employee->id,
        'service_id' => $service->id,
        'date' => now()->addDay()->format('Y-m-d'),
        'start_time' => '11:00',
    ]);

    $appointmentId = $response->json('appointment.id');

    $cancelResponse = $this->actingAs($customer)->postJson("/api/booking/appointments/{$appointmentId}/cancel");

    $cancelResponse->assertOk()
        ->assertJsonPath('appointment.status', 'cancelled');
});

test('customer cannot cancel other users appointment', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $employeeUser = User::factory()->create(['role' => UserRole::Employee]);
    $customerA = User::factory()->create(['role' => UserRole::Customer]);
    $customerB = User::factory()->create(['role' => UserRole::Customer]);

    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست ۴',
        'slug' => 'test-salon-cancel-auth',
        'is_active' => true,
    ]);

    $service = Service::create([
        'business_id' => $business->id,
        'name' => 'خدمت',
        'duration_minutes' => 30,
        'price' => 100000,
        'is_active' => true,
    ]);

    $employee = Employee::create([
        'business_id' => $business->id,
        'user_id' => $employeeUser->id,
        'is_active' => true,
    ]);

    $employee->services()->attach($service->id);

    WorkingHour::create([
        'employee_id' => $employee->id,
        'day_of_week' => now()->addDay()->dayOfWeek,
        'start_time' => '09:00',
        'end_time' => '18:00',
        'is_day_off' => false,
    ]);

    $response = $this->actingAs($customerA)->postJson('/api/booking/appointments', [
        'employee_id' => $employee->id,
        'service_id' => $service->id,
        'date' => now()->addDay()->format('Y-m-d'),
        'start_time' => '12:00',
    ]);

    $appointmentId = $response->json('appointment.id');

    $this->actingAs($customerB)->postJson("/api/booking/appointments/{$appointmentId}/cancel")
        ->assertStatus(403);
});
