<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use App\Models\Business;
use App\Services\Admin\DashboardService;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService)
    {
    }

    public function show(Business $business): DashboardResource
    {
        return new DashboardResource($this->dashboardService->stats($business));
    }
}