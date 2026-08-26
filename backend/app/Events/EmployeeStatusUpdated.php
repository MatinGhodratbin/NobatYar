<?php

namespace App\Events;

use App\Models\Employee;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EmployeeStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Employee $employee)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('business.'.$this->employee->business_id.'.queue'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'employee.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'employee_id' => $this->employee->id,
            'status' => $this->employee->status,
        ];
    }
}