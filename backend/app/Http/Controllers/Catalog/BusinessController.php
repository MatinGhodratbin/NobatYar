<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Resources\BusinessResource;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BusinessController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $businesses = Business::query()
            ->where('is_active', true)
            ->when(
                $request->query('search'),
                fn ($q, $search) => $q->where('name', 'like', "%{$search}%")
            )
            ->orderBy('name')
            ->paginate(12);

        return BusinessResource::collection($businesses);
    }

    public function show(string $slug): JsonResponse
    {
        $business = Business::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return response()->json(['business' => new BusinessResource($business)]);
    }
}