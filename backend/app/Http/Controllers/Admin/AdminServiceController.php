<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Business;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminServiceController extends Controller
{
    public function index(Business $business): AnonymousResourceCollection
    {
        return ServiceResource::collection($business->services()->latest()->get());
    }

    public function store(StoreServiceRequest $request, Business $business): JsonResponse
    {
        $service = $business->services()->create($request->validated());

        return response()->json(['service' => new ServiceResource($service)], 201);
    }

    public function update(StoreServiceRequest $request, Business $business, Service $service): JsonResponse
    {
        if ($service->business_id !== $business->id) {
            return response()->json(['message' => 'این خدمت متعلق به این کسب‌وکار نیست.'], 404);
        }

        $service->update($request->validated());

        return response()->json(['service' => new ServiceResource($service)]);
    }

    public function destroy(Business $business, Service $service): JsonResponse
    {
        if ($service->business_id !== $business->id) {
            return response()->json(['message' => 'این خدمت متعلق به این کسب‌وکار نیست.'], 404);
        }

        $service->update(['is_active' => false]);

        return response()->json(['message' => 'خدمت غیرفعال شد.']);
    }
}