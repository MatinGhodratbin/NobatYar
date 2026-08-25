<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QueueStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Appointment $appointment,
        public int $peopleAhead,
        public int $estimatedMinutes,
        public int $progressPercent,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('appointment.'.$this->appointment->id),
            new PrivateChannel('business.'.$this->appointment->business_id.'.queue'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'queue.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'status' => $this->appointment->status,
            'people_ahead' => $this->peopleAhead,
            'estimated_minutes' => $this->estimatedMinutes,
            'progress_percent' => $this->progressPercent,
        ];
    }
}