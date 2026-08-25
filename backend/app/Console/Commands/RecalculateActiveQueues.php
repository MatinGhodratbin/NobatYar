<?php

namespace App\Console\Commands;

use App\Jobs\RecalculateAppointmentQueueJob;
use App\Models\Appointment;
use Illuminate\Console\Command;

class RecalculateActiveQueues extends Command
{
    protected $signature = 'appointments:recalculate-queue';

    protected $description = 'محاسبه دوره‌ای موقعیت صف و broadcast آن برای نوبت‌های فعال امروز';

    public function handle(): int
    {
        $appointments = Appointment::query()
            ->whereDate('appointment_date', now()->toDateString())
            ->whereIn('status', ['confirmed', 'in_queue', 'in_progress'])
            ->get(['id']);

        foreach ($appointments as $appointment) {
            RecalculateAppointmentQueueJob::dispatch($appointment->id);
        }

        $this->info("موقعیت صف برای {$appointments->count()} نوبت فعال بازمحاسبه شد.");

        return self::SUCCESS;
    }
}