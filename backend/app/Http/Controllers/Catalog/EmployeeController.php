<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EmployeeController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $business = Business::where('slug', $request->query('business_slug'))
            ->where('is_active', true)
            ->firstOrFail();

        $employees = $business->employees()
            ->where('is_active', true)
            ->when(
                $request->query('service_id'),
                fn ($q, $serviceId) => $q->whereHas('services', fn ($sq) => $sq->where('services.id', $serviceId))
            )
            ->with('user')
            ->get();

        return EmployeeResource::collection($employees);
    }
}