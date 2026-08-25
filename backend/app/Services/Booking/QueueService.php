<?php

namespace App\Services\Booking;

use App\Events\QueueStatusUpdated;
use App\Models\Appointment;

class QueueService
{
    /**
     * تعداد نفرات جلوتر از این نوبت در صف همان متخصص، در همان روز.
     * ملاک "جلوتر بودن": start_time کوچک‌تر و وضعیت هنوز تکمیل/لغو نشده.
     */
    public function peopleAhead(Appointment $appointment): int
    {
        return Appointment::where('employee_id', $appointment->employee_id)
            ->whereDate('appointment_date', $appointment->appointment_date)
            ->where('start_time', '<', $appointment->start_time)
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->count();
    }

    /**
     * تخمین زمان انتظار: تعداد نفرات جلوتر ضرب‌در میانگین مدت‌زمان خدماتشون.
     */
    public function estimatedWaitMinutes(Appointment $appointment): int
    {
        $ahead = Appointment::where('employee_id', $appointment->employee_id)
            ->whereDate('appointment_date', $appointment->appointment_date)
            ->where('start_time', '<', $appointment->start_time)
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->with('service')
            ->get();

        return (int) $ahead->sum(fn ($a) => $a->service->duration_minutes);
    }

    /**
     * درصد پیشرفت صف برای نمایش progress bar (بر اساس مراحل ثابت وضعیت).
     */
    public function progressPercent(Appointment $appointment): int
    {
        return match ($appointment->status) {
            'pending' => 10,
            'confirmed' => 25,
            'in_queue' => 50,
            'in_progress' => 85,
            'completed' => 100,
            'cancelled' => 0,
            default => 0,
        };
    }

    public function broadcastStatus(Appointment $appointment): void
    {
        broadcast(new QueueStatusUpdated(
            appointment: $appointment,
            peopleAhead: $this->peopleAhead($appointment),
            estimatedMinutes: $this->estimatedWaitMinutes($appointment),
            progressPercent: $this->progressPercent($appointment),
        ));
    }
}