<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Service $service): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isBusinessOwner();
    }

    public function update(User $user, Service $service): bool
    {
        return $user->isBusinessOwner() && $user->id === $service->business->owner_id;
    }

    public function delete(User $user, Service $service): bool
    {
        return $user->isBusinessOwner() && $user->id === $service->business->owner_id;
    }
}
