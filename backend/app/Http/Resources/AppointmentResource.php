<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'status' => $this->status,
            'appointment_date' => $this->appointment_date->format('Y-m-d'),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'price' => $this->price,
            'service' => [
                'id' => $this->service->id,
                'name' => $this->service->name,
                'duration_minutes' => $this->service->duration_minutes,
            ],
            'employee' => [
                'id' => $this->employee->id,
                'name' => $this->employee->user->name,
                'position' => $this->employee->position,
            ],
            'business' => [
                'id' => $this->business->id,
                'name' => $this->business->name,
            ],
        ];
    }
}