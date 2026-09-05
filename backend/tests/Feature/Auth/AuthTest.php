<?php

use App\Enums\UserRole;
use App\Models\User;

test('customer can register successfully', function () {
    $response = $this->postJson('/api/auth/register', [
        'name' => 'علی رضایی',
        'email' => 'ali@example.com',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['user', 'token']);

    $this->assertDatabaseHas('users', ['email' => 'ali@example.com']);
});

test('registration fails with duplicate email', function () {
    User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->postJson('/api/auth/register', [
        'name' => 'Test',
        'email' => 'existing@example.com',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);

    $response->assertStatus(422);
});

test('customer can login successfully', function () {
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('Password123'),
        'role' => UserRole::Customer,
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'Password123',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['user', 'token']);
});

test('login fails with wrong password', function () {
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('Password123'),
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422);
});

test('authenticated user can get current user', function () {
    $user = User::factory()->create(['role' => UserRole::Customer]);

    $response = $this->actingAs($user)->getJson('/api/auth/user');

    $response->assertOk()
        ->assertJsonPath('data.email', $user->email);
});

test('unauthenticated request is rejected', function () {
    $response = $this->getJson('/api/auth/user');

    $response->assertStatus(401);
});
