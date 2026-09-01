<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $business = Business::where('slug', $request->query('business_slug'))
            ->where('is_active', true)
            ->firstOrFail();

        $services = $business->services()
            ->where('is_active', true)
            ->when(
                $request->query('search'),
                fn ($q, $search) => $q->where('name', 'like', "%{$search}%")
            )
            ->get();

        return response()->json(ServiceResource::collection($services));
    }
}