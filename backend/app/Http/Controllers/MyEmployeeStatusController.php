<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\UpdateEmployeeStatusRequest;
use App\Services\Admin\EmployeeStatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyEmployeeStatusController extends Controller
{
    public function __construct(private readonly EmployeeStatusService $statusService)
    {
    }

    public function update(UpdateEmployeeStatusRequest $request): JsonResponse
    {
        $employee = $request->user()->employeeProfile;

        if (! $employee) {
            return response()->json(['message' => 'شما به‌عنوان کارمند در هیچ کسب‌وکاری ثبت نشده‌اید.'], 404);
        }

        $employee = $this->statusService->updateStatus($employee, $request->validated()['status']);

        return response()->json(['employee' => ['id' => $employee->id, 'status' => $employee->status]]);
    }
}