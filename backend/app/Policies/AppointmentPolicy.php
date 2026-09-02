<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isBusinessOwner() || $user->isEmployee();
    }

    public function view(User $user, Appointment $appointment): bool
    {
        if ($user->id === $appointment->customer_id) {
            return true;
        }

        if ($user->isBusinessOwner() && $user->id === $appointment->business->owner_id) {
            return true;
        }

        if ($user->isEmployee() && $appointment->employee->user_id === $user->id) {
            return true;
        }

        return false;
    }

    public function updateStatus(User $user, Appointment $appointment): bool
    {
        if ($user->isBusinessOwner() && $user->id === $appointment->business->owner_id) {
            return true;
        }

        if ($user->isEmployee() && $appointment->employee->user_id === $user->id) {
            return true;
        }

        return false;
    }

    public function cancel(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->customer_id;
    }
}
