<?php

namespace App\Services\Onboarding;

use App\Enums\UserRole;
use App\Exceptions\BusinessAlreadyExistsException;
use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class BusinessOnboardingService
{
    public function create(User $user, array $data): Business
    {
        return DB::transaction(function () use ($user, $data) {
            $alreadyOwner = Business::where('owner_id', $user->id)->exists();

            if ($alreadyOwner) {
                throw new BusinessAlreadyExistsException();
            }

            $business = Business::create([
                'owner_id' => $user->id,
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'] ?? null,
                'address' => $data['address'] ?? null,
                'phone' => $data['phone'] ?? null,
            ]);

            if ($user->role !== UserRole::BusinessOwner) {
                $user->update(['role' => UserRole::BusinessOwner]);
            }

            return $business;
        });
    }
}