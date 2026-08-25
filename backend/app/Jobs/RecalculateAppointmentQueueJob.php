<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\Booking\QueueService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RecalculateAppointmentQueueJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public int $appointmentId)
    {
    }

    public function handle(QueueService $queueService): void
    {
        $appointment = Appointment::find($this->appointmentId);

        if (! $appointment || in_array($appointment->status, ['completed', 'cancelled'], true)) {
            return;
        }

        $queueService->broadcastStatus($appointment);
    }
}