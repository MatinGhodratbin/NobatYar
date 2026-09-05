<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\Business;
use App\Models\Employee;
use App\Models\Service;
use App\Models\User;
use App\Models\WorkingHour;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── کاربران ──────────────────────────────────────────────
        $owner = User::create([
            'name' => 'محمد رضایی',
            'email' => 'owner@test.com',
            'password' => Hash::make('Password123'),
            'role' => UserRole::BusinessOwner,
            'email_verified_at' => now(),
        ]);

        $employeeUser1 = User::create([
            'name' => 'علی محمدی',
            'email' => 'employee1@test.com',
            'password' => Hash::make('Password123'),
            'role' => UserRole::Employee,
            'email_verified_at' => now(),
        ]);

        $employeeUser2 = User::create([
            'name' => 'زهرا کریمی',
            'email' => 'employee2@test.com',
            'password' => Hash::make('Password123'),
            'role' => UserRole::Employee,
            'email_verified_at' => now(),
        ]);

        $customer = User::create([
            'name' => 'سارا احمدی',
            'email' => 'customer@test.com',
            'password' => Hash::make('Password123'),
            'role' => UserRole::Customer,
            'email_verified_at' => now(),
        ]);

        // ── کسب‌وکار ─────────────────────────────────────────────
        $business = Business::create([
            'owner_id' => $owner->id,
            'name' => 'سالن زیبایی نوبت‌یار',
            'slug' => 'nobyar-salon',
            'description' => 'سالن زیبایی و پیرایش حرفه‌ای با بیش از ۱۰ سال سابقه',
            'address' => 'تهران، خیابان ولیعصر، نبش کوچه ۱۲',
            'phone' => '02112345678',
            'timezone' => 'Asia/Tehran',
            'is_active' => true,
        ]);

        // ── خدمات ────────────────────────────────────────────────
        $services = [
            Service::create([
                'business_id' => $business->id,
                'name' => 'کوتاهی مو مردانه',
                'description' => 'کوتاهی مو با جدیدترین مدل‌ها',
                'duration_minutes' => 30,
                'price' => 150000,
                'is_active' => true,
            ]),
            Service::create([
                'business_id' => $business->id,
                'name' => 'کوتاهی مو زنانه',
                'description' => 'کوتاهی و فرم‌دهی مو زنانه',
                'duration_minutes' => 45,
                'price' => 250000,
                'is_active' => true,
            ]),
            Service::create([
                'business_id' => $business->id,
                'name' => 'رنگ مو',
                'description' => 'رنگ مو با برندهای معتبر',
                'duration_minutes' => 90,
                'price' => 500000,
                'is_active' => true,
            ]),
            Service::create([
                'business_id' => $business->id,
                'name' => 'اصلاح صورت',
                'description' => 'اصلاح و مرتب کردن ریش',
                'duration_minutes' => 20,
                'price' => 80000,
                'is_active' => true,
            ]),
        ];

        // ── پرسنل ───────────────────────────────────────────────
        $employee1 = Employee::create([
            'business_id' => $business->id,
            'user_id' => $employeeUser1->id,
            'position' => 'آرایشگر ارشد',
            'is_active' => true,
            'status' => 'working',
        ]);

        $employee2 = Employee::create([
            'business_id' => $business->id,
            'user_id' => $employeeUser2->id,
            'position' => 'رنگ‌کار',
            'is_active' => true,
            'status' => 'working',
        ]);

        // اتصال پرسنل به خدمات
        $employee1->services()->attach([$services[0]->id, $services[1]->id, $services[3]->id]);
        $employee2->services()->attach([$services[1]->id, $services[2]->id]);

        // ── ساعات کاری (شنبه تا پنجشنبه) ─────────────────────────
        $workingDays = [0, 1, 2, 3, 4, 5]; // شنبه تا پنجشنبه
        foreach ([$employee1, $employee2] as $emp) {
            foreach ($workingDays as $day) {
                WorkingHour::create([
                    'employee_id' => $emp->id,
                    'day_of_week' => $day,
                    'start_time' => '09:00',
                    'end_time' => '18:00',
                    'is_day_off' => false,
                ]);
            }
            // جمعه تعطیل
            WorkingHour::create([
                'employee_id' => $emp->id,
                'day_of_week' => 6,
                'start_time' => null,
                'end_time' => null,
                'is_day_off' => true,
            ]);
        }

        // ── نوبت‌های نمونه ───────────────────────────────────────
        $statuses = ['pending', 'confirmed', 'in_queue', 'in_progress', 'completed', 'cancelled'];
        $codes = ['APT-260901-ABC123', 'APT-260901-DEF456', 'APT-260902-GHI789', 'APT-260902-JKL012', 'APT-260903-MNO345'];

        for ($i = 0; $i < 5; $i++) {
            $date = now()->addDays($i - 2)->format('Y-m-d');
            $startHour = 9 + $i;
            $service = $services[$i % count($services)];
            $employee = $i % 2 === 0 ? $employee1 : $employee2;
            $start = Carbon::parse(sprintf('%02d:00', $startHour));
            $end = $start->copy()->addMinutes($service->duration_minutes);

            Appointment::create([
                'code' => $codes[$i],
                'business_id' => $business->id,
                'service_id' => $service->id,
                'employee_id' => $employee->id,
                'customer_id' => $customer->id,
                'appointment_date' => $date,
                'start_time' => $start->format('H:i:s'),
                'end_time' => $end->format('H:i:s'),
                'status' => $statuses[$i],
                'price' => $service->price,
                'notes' => $i === 0 ? 'نوبت اول مشتری' : null,
            ]);
        }
    }
}
