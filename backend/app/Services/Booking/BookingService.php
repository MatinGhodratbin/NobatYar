<?php

namespace App\Services\Booking;

use App\Exceptions\SlotUnavailableException;
use App\Models\Appointment;
use App\Models\Employee;
use App\Models\Service;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingService
{
    /**
     * ثبت نوبت با محافظت در برابر race condition.
     *
     * استراتژی: تراکنش دیتابیسی + lockForUpdate روی ردیف‌های appointment
     * همان employee/تاریخ، تا دو درخواست هم‌زمان نتونن یک بازه‌ی هم‌پوشان رو
     * هم‌زمان رزرو کنن. lockForUpdate باعث می‌شه تراکنش دوم تا پایان تراکنش
     * اول (commit/rollback) بلاک بشه، نه اینکه هر دو هم‌زمان overlap check
     * رو با داده‌ی قدیمی پاس کنن.
     */
    public function book(User $customer, Employee $employee, Service $service, string $date, string $startTime): Appointment
    {
        $timezone = $employee->business->timezone ?? 'UTC';

        // بررسی اعتبار روابط دامنه
        if (! $employee->business->is_active) {
            throw new SlotUnavailableException('کسب‌وکار موردنظر غیرفعال است.');
        }

        if (! $employee->is_active) {
            throw new SlotUnavailableException('پرسنل موردنظر غیرفعال است.');
        }

        if (! $service->is_active) {
            throw new SlotUnavailableException('خدمت موردنظر غیرفعال است.');
        }

        if (! $employee->services()->where('services.id', $service->id)->exists()) {
            throw new SlotUnavailableException('پرسنل موردنظر این خدمت را ارائه نمی‌دهد.');
        }

        return DB::transaction(function () use ($customer, $employee, $service, $date, $startTime, $timezone) {
            $endTime = CarbonImmutable::parse($date.' '.$startTime, $timezone)
                ->addMinutes($service->duration_minutes)
                ->format('H:i:s');

            // قفل‌کردن تمام appointment های همین متخصص در همین روز تا پایان تراکنش
            $conflicting = Appointment::where('employee_id', $employee->id)
                ->whereDate('appointment_date', $date)
                ->whereNotIn('status', ['cancelled'])
                ->where('start_time', '<', $endTime)
                ->where('end_time', '>', $startTime)
                ->lockForUpdate()
                ->exists();

            if ($conflicting) {
                throw new SlotUnavailableException();
            }

            $appointment = Appointment::create([
                'code' => $this->generateCode(),
                'business_id' => $employee->business_id,
                'service_id' => $service->id,
                'employee_id' => $employee->id,
                'customer_id' => $customer->id,
                'appointment_date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'status' => 'pending',
                'price' => $service->price,
            ]);

            return $appointment->fresh(['service', 'employee.user', 'business']);
        });
    }

    public function cancel(Appointment $appointment): Appointment
    {
        $cancellableStatuses = ['pending', 'confirmed', 'in_queue'];

        if (! in_array($appointment->status, $cancellableStatuses)) {
            throw new \App\Exceptions\SlotUnavailableException('این نوبت قابل لغو نیست.');
        }

        $appointment->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        $appointment->refresh();

        $this->queueService->broadcastStatus($appointment);

        return $appointment;
    }

    private function generateCode(): string
    {
        $date = now()->format('ymd');
        $random = strtoupper(Str::random(6));

        return "APT-{$date}-{$random}";
    }

    public function __construct(private readonly \App\Services\Booking\QueueService $queueService)
    {
    }

    public function updateStatus(Appointment $appointment, string $status): Appointment
    {
        $appointment->update(['status' => $status]);

        $this->queueService->broadcastStatus($appointment);

        return $appointment->fresh();
    }
}
