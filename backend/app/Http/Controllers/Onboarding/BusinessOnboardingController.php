<?php

namespace App\Http\Controllers\Onboarding;

use App\Exceptions\BusinessAlreadyExistsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Onboarding\StoreBusinessRequest;
use App\Services\Onboarding\BusinessOnboardingService;
use Illuminate\Http\JsonResponse;

class BusinessOnboardingController extends Controller
{
    public function __construct(private readonly BusinessOnboardingService $onboardingService)
    {
    }

    public function store(StoreBusinessRequest $request): JsonResponse
    {
        try {
            $business = $this->onboardingService->create($request->user(), $request->validated());
        } catch (BusinessAlreadyExistsException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json([
            'business' => ['id' => $business->id, 'name' => $business->name, 'slug' => $business->slug],
        ], 201);
    }
}