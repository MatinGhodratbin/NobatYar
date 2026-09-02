<?php

namespace App\Services\Admin;

use App\Enums\UserRole;
use App\Models\Business;
use App\Models\Employee;
use App\Models\User;
use App\Models\WorkingHour;
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

        // ایجاد ساعات کاری پیش‌فرض (شنبه تا پنجشنبه ۹-۱۷، جمعه استراحت)
        for ($day = 0; $day < 7; $day++) {
            WorkingHour::create([
                'employee_id' => $employee->id,
                'day_of_week' => $day,
                'start_time' => $day === 6 ? null : '09:00',
                'end_time' => $day === 6 ? null : '17:00',
                'is_day_off' => $day === 6,
            ]);
        }

        return $employee->load(['user', 'services']);
    }
}