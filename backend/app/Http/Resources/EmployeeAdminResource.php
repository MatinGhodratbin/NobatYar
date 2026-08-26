<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeAdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user->name,
            'email' => $this->user->email,
            'phone' => $this->user->phone,
            'position' => $this->position,
            'is_active' => $this->is_active,
            'status' => $this->status,
            'services' => $this->whenLoaded('services', fn () => $this->services->pluck('name')),
        ];
    }
}