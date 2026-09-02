<?php

namespace App\Console\Commands;

use App\Jobs\SendAppointmentReminderJob;
use App\Models\Appointment;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

class SendDueReminders extends Command
{
    protected $signature = 'appointments:send-reminders';

    protected $description = 'ارسال یادآوری برای نوبت‌هایی که تا ۳۰ دقیقه دیگر شروع می‌شوند و هنوز یادآوری نگرفته‌اند';

    public function handle(): int
    {
        $appointments = Appointment::query()
            ->whereNull('reminded_at')
            ->whereNotIn('status', ['cancelled', 'completed'])
            ->with('business')
            ->get()
            ->filter(function (Appointment $appointment) {
                $timezone = $appointment->business->timezone ?? 'UTC';
                $now = CarbonImmutable::now($timezone);
                $windowEnd = $now->addMinutes(30);

                $startsAt = CarbonImmutable::parse(
                    $appointment->appointment_date->format('Y-m-d').' '.$appointment->start_time,
                    $timezone
                );

                return $startsAt->between($now, $windowEnd);
            });

        foreach ($appointments as $appointment) {
            SendAppointmentReminderJob::dispatch($appointment->id);
        }

        $this->info("تعداد {$appointments->count()} یادآوری در صف ارسال قرار گرفت.");

        return self::SUCCESS;
    }
}
