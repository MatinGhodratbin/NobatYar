<?php

namespace App\Services\Admin;

use App\Enums\UserRole;
use App\Models\Business;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EmployeeOnboardingService
{
    /**
     * ساخت یک اکانت کاربری جدید با نقش employee و اتصالش به کسب‌وکار.
     * رمز عبور موقت تصادفی تولید می‌شه (کارمند از طریق «فراموشی رمز عبور» می‌تونه ستش کنه).
     */
    public function create(Business $business, array $data): Employee
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make(Str::random(24)),
            'role' => UserRole::Employee,
        ]);

        $employee = Employee::create([
            'business_id' => $business->id,
            'user_id' => $user->id,
            'position' => $data['position'] ?? null,
        ]);

        if (! empty($data['service_ids'])) {
            $employee->services()->sync($data['service_ids']);
        }

        return $employee->load(['user', 'services']);
    }
}