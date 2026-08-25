<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_appointments' => $this['total_appointments'],
            'monthly_revenue' => $this['monthly_revenue'],
            'new_customers' => $this['new_customers'],
            'service_distribution' => $this['service_distribution']->map(fn ($row) => [
                'service_name' => $row->service_name,
                'total' => (int) $row->total,
            ]),
            'revenue_trend' => $this['revenue_trend']->map(fn ($row) => [
                'day' => $row->day,
                'total' => (int) $row->total,
            ]),
            'recent_appointments' => AppointmentResource::collection($this['recent_appointments']),
        ];
    }
}