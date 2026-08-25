<?php

namespace App\Services\Booking;

use App\Exceptions\SlotUnavailableException;
use App\Models\Appointment;
use App\Models\Employee;
use App\Models\Service;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

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
        return DB::transaction(function () use ($customer, $employee, $service, $date, $startTime) {
            $endTime = CarbonImmutable::parse($date.' '.$startTime)
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
        $appointment->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        $this->queueService->broadcastStatus($appointment);

        return $appointment;
    }

    private function generateCode(): string
    {
        $lastId = Appointment::max('id') ?? 0;

        return 'APT-'.($lastId + 1001);
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