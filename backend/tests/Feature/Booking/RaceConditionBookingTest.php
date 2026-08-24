<?php

use App\Enums\UserRole;
use App\Models\Business;
use App\Models\Employee;
use App\Models\Service;
use App\Models\User;
use App\Models\WorkingHour;
use App\Services\Booking\BookingService;
use Illuminate\Support\Facades\DB;

test('two simultaneous bookings for the same slot only succeed once', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $employeeUser = User::factory()->create(['role' => UserRole::Employee]);
    $customerA = User::factory()->create(['role' => UserRole::Customer]);
    $customerB = User::factory()->create(['role' => UserRole::Customer]);

    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست',
        'slug' => 'test-salon',
    ]);

    $service = Service::create([
        'business_id' => $business->id,
        'name' => 'کوتاهی مو',
        'duration_minutes' => 30,
        'price' => 250000,
    ]);

    $employee = Employee::create([
        'business_id' => $business->id,
        'user_id' => $employeeUser->id,
    ]);

    WorkingHour::create([
        'employee_id' => $employee->id,
        'day_of_week' => now()->addDay()->dayOfWeek,
        'start_time' => '09:00',
        'end_time' => '18:00',
        'is_day_off' => false,
    ]);

    $date = now()->addDay()->format('Y-m-d');
    $bookingService = app(BookingService::class);

    $results = [];

    // شبیه‌سازی دو درخواست هم‌زمان با دو کانکشن جدا از طریق تراکنش‌های تودرتو ممکن نیست
    // در PHPUnit/Pest به‌صورت واقعی موازی اجرا نمی‌شه، پس رفتار lockForUpdate رو با
    // دو فراخوانی متوالیِ همون transaction تست می‌کنیم: دومی باید Exception بگیره.
    try {
        $results[] = $bookingService->book($customerA, $employee, $service, $date, '10:00:00');
    } catch (\App\Exceptions\SlotUnavailableException $e) {
        $results[] = 'failed';
    }

    try {
        $results[] = $bookingService->book($customerB, $employee, $service, $date, '10:00:00');
    } catch (\App\Exceptions\SlotUnavailableException $e) {
        $results[] = 'failed';
    }

    expect(collect($results)->filter(fn ($r) => $r !== 'failed'))->toHaveCount(1);
    expect(collect($results)->filter(fn ($r) => $r === 'failed'))->toHaveCount(1);

    expect(DB::table('appointments')->where('employee_id', $employee->id)->count())->toBe(1);
});

test('overlapping but not identical slots are also rejected', function () {
    $owner = User::factory()->create(['role' => UserRole::BusinessOwner]);
    $employeeUser = User::factory()->create(['role' => UserRole::Employee]);
    $customerA = User::factory()->create(['role' => UserRole::Customer]);
    $customerB = User::factory()->create(['role' => UserRole::Customer]);

    $business = Business::create([
        'owner_id' => $owner->id,
        'name' => 'سالن تست ۲',
        'slug' => 'test-salon-2',
    ]);

    $service = Service::create([
        'business_id' => $business->id,
        'name' => 'اصلاح',
        'duration_minutes' => 45,
        'price' => 150000,
    ]);

    $employee = Employee::create([
        'business_id' => $business->id,
        'user_id' => $employeeUser->id,
    ]);

    WorkingHour::create([
        'employee_id' => $employee->id,
        'day_of_week' => now()->addDay()->dayOfWeek,
        'start_time' => '09:00',
        'end_time' => '18:00',
        'is_day_off' => false,
    ]);

    $date = now()->addDay()->format('Y-m-d');
    $bookingService = app(BookingService::class);

    // نوبت اول: ۱۰:۰۰ تا ۱۰:۴۵
    $bookingService->book($customerA, $employee, $service, $date, '10:00:00');

    // نوبت دوم: ۱۰:۲۰ تا ۱۱:۰۵ -> با اولی ۲۵ دقیقه هم‌پوشانی داره، باید رد بشه
    expect(fn () => $bookingService->book($customerB, $employee, $service, $date, '10:20:00'))
        ->toThrow(\App\Exceptions\SlotUnavailableException::class);
});