<?php

namespace App\Jobs;

use App\Events\AppointmentReminderDue;
use App\Models\Appointment;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendAppointmentReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public int $appointmentId)
    {
    }

    public function handle(): void
    {
        $appointment = Appointment::find($this->appointmentId);

        // ممکنه بین dispatch و اجرا، نوبت لغو شده باشه؛ در اون صورت یادآوری بی‌معنیه.
        if (! $appointment || $appointment->status === 'cancelled' || $appointment->reminded_at) {
            return;
        }

        $startsAt = CarbonImmutable::parse($appointment->appointment_date->format('Y-m-d').' '.$appointment->start_time);
        $minutesUntilStart = max(0, (int) CarbonImmutable::now()->diffInMinutes($startsAt, false));

        broadcast(new AppointmentReminderDue($appointment, $minutesUntilStart));

        $appointment->update(['reminded_at' => now()]);
    }
}