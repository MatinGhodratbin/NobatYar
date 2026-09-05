<?php

namespace App\Services\Admin;

use App\Models\Appointment;
use App\Models\Business;
use Carbon\CarbonImmutable;

class DashboardService
{
    public function stats(Business $business, ?string $from = null, ?string $to = null): array
    {
        $today = CarbonImmutable::today();
        $fromDate = $from ? CarbonImmutable::parse($from) : $today->subDays(6);
        $toDate = $to ? CarbonImmutable::parse($to) : $today;

        $baseQuery = fn () => Appointment::where('business_id', $business->id);

        $totalAppointments = $baseQuery()
            ->whereBetween('appointment_date', [$fromDate, $toDate])
            ->count();

        $monthlyRevenue = $baseQuery()
            ->where('status', 'completed')
            ->whereBetween('appointment_date', [$fromDate, $toDate])
            ->sum('price');

        $newCustomers = $baseQuery()
            ->whereBetween('created_at', [$fromDate->startOfDay(), $toDate->endOfDay()])
            ->distinct('customer_id')
            ->count('customer_id');

        $serviceDistribution = Appointment::where('appointments.business_id', $business->id)
            ->selectRaw('services.name as service_name, count(*) as total')
            ->join('services', 'services.id', '=', 'appointments.service_id')
            ->whereNotIn('appointments.status', ['cancelled'])
            ->whereBetween('appointments.appointment_date', [$fromDate, $toDate])
            ->groupBy('services.name')
            ->orderByDesc('total')
            ->limit(6)
            ->get();

        $revenueTrend = $baseQuery()
            ->selectRaw('DATE(appointment_date) as day, SUM(price) as total')
            ->where('status', 'completed')
            ->whereBetween('appointment_date', [$fromDate, $toDate])
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        $recentAppointments = $baseQuery()
            ->with(['service', 'employee.user', 'customer'])
            ->whereBetween('appointment_date', [$fromDate, $toDate])
            ->latest('created_at')
            ->limit(10)
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