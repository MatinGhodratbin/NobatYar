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
        $now = CarbonImmutable::now();
        $windowEnd = $now->addMinutes(30);

        $appointments = Appointment::query()
            ->whereDate('appointment_date', $now->toDateString())
            ->whereNull('reminded_at')
            ->whereNotIn('status', ['cancelled', 'completed'])
            ->get()
            ->filter(function (Appointment $appointment) use ($now, $windowEnd) {
                $startsAt = CarbonImmutable::parse(
                    $appointment->appointment_date->format('Y-m-d').' '.$appointment->start_time
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