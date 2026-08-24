<?php

namespace App\Services\Booking;

use App\Models\Employee;
use App\Models\Service;
use Carbon\Carbon;
use Carbon\CarbonImmutable;

class AvailabilityService
{
    public function getAvailableSlots(Employee $employee, Service $service, string $date): array
    {
        $carbonDate = Carbon::parse($date);
        $dayOfWeek = $this->toDayOfWeek($carbonDate);

        $workingHour = $employee->workingHours()
            ->where('day_of_week', $dayOfWeek)
            ->first();

        if (! $workingHour || $workingHour->is_day_off) {
            return [];
        }

        $duration = $service->duration_minutes;

        $existingAppointments = $employee->appointments()
            ->whereDate('appointment_date', $date)
            ->whereNotIn('status', ['cancelled'])
            ->orderBy('start_time')
            ->get(['start_time', 'end_time']);

        $slots = [];
        $cursor = CarbonImmutable::parse($date.' '.$workingHour->start_time);
        $end = CarbonImmutable::parse($date.' '.$workingHour->end_time);

        while ($cursor->addMinutes($duration)->lte($end)) {
            $candidateStart = $cursor;
            $candidateEnd = $cursor->addMinutes($duration);

            $hasOverlap = $existingAppointments->contains(function ($appointment) use ($candidateStart, $candidateEnd, $date) {
                $existingStart = CarbonImmutable::parse($date.' '.$appointment->start_time);
                $existingEnd = CarbonImmutable::parse($date.' '.$appointment->end_time);

                return $candidateStart->lt($existingEnd) && $candidateEnd->gt($existingStart);
            });

            $isPast = $candidateStart->lt(CarbonImmutable::now());

            if (! $hasOverlap && ! $isPast) {
                $slots[] = [
                    'start' => $candidateStart->format('H:i'),
                    'end' => $candidateEnd->format('H:i'),
                ];
            }

            $cursor = $cursor->addMinutes($duration);
        }

        return $slots;
    }

    private function toDayOfWeek(Carbon $date): int
    {
        return ($date->dayOfWeek + 1) % 7;
    }
}