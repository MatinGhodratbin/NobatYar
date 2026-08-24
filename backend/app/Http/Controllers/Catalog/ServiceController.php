<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $services = Service::query()
            ->where('is_active', true)
            ->when($request->query('business_id'), fn ($q, $id) => $q->where('business_id', $id))
            ->get();

        return response()->json($services);
    }
}