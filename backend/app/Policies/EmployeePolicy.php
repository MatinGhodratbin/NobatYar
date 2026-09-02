<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;

class EmployeePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isBusinessOwner();
    }

    public function view(User $user, Employee $employee): bool
    {
        return $user->isBusinessOwner() && $user->id === $employee->business->owner_id;
    }

    public function create(User $user): bool
    {
        return $user->isBusinessOwner();
    }

    public function delete(User $user, Employee $employee): bool
    {
        return $user->isBusinessOwner() && $user->id === $employee->business->owner_id;
    }
}
