<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use App\Models\Business;
use App\Services\Admin\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService)
    {
    }

    public function show(Request $request, Business $business): DashboardResource
    {
        return new DashboardResource($this->dashboardService->stats(
            $business,
            $request->query('from'),
            $request->query('to')
        ));
    }
}