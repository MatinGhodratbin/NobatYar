<?php

namespace App\Services\Admin;

use App\Models\Appointment;
use App\Models\Business;
use Carbon\CarbonImmutable;

class DashboardService
{
    public function stats(Business $business): array
    {
        $today = CarbonImmutable::today();
        $weekAgo = $today->subDays(6);

        $baseQuery = fn () => Appointment::where('business_id', $business->id);

        $totalAppointments = $baseQuery()->count();

        $monthlyRevenue = $baseQuery()
            ->where('status', 'completed')
            ->whereMonth('appointment_date', now()->month)
            ->sum('price');

        $newCustomers = $baseQuery()
            ->whereMonth('created_at', now()->month)
            ->distinct('customer_id')
            ->count('customer_id');

        $avgWaitMinutes = (int) $baseQuery()
            ->whereDate('appointment_date', $today)
            ->whereIn('status', ['confirmed', 'in_queue'])
            ->avg('start_time');

        $serviceDistribution = $baseQuery()
            ->selectRaw('services.name as service_name, count(*) as total')
            ->join('services', 'services.id', '=', 'appointments.service_id')
            ->whereNotIn('appointments.status', ['cancelled'])
            ->groupBy('services.name')
            ->orderByDesc('total')
            ->limit(6)
            ->get();

        $revenueTrend = $baseQuery()
            ->selectRaw('DATE(appointment_date) as day, SUM(price) as total')
            ->where('status', 'completed')
            ->whereBetween('appointment_date', [$weekAgo, $today])
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        $recentAppointments = $baseQuery()
            ->with(['service', 'employee.user', 'customer'])
            ->latest('created_at')
            ->limit(5)
            ->get();

        return [
            'total_appointments' => $totalAppointments,
            'monthly_revenue' => (int) $monthlyRevenue,
            'new_customers' => $newCustomers,
            'service_distribution' => $serviceDistribution,
            'revenue_trend' => $revenueTrend,
            'recent_appointments' => $recentAppointments,
        ];
    }
}