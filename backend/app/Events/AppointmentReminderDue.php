<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentReminderDue implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Appointment $appointment,
        public int $minutesUntilStart,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('appointment.'.$this->appointment->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'reminder.due';
    }

    public function broadcastWith(): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'minutes_until_start' => $this->minutesUntilStart,
            'message' => "نوبت شما تا {$this->minutesUntilStart} دقیقه دیگر شروع می‌شود.",
        ];
    }
}