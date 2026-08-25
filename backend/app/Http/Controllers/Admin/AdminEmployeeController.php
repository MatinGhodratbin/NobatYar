<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEmployeeRequest;
use App\Http\Resources\EmployeeAdminResource;
use App\Models\Business;
use App\Models\Employee;
use App\Services\Admin\EmployeeOnboardingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminEmployeeController extends Controller
{
    public function __construct(private readonly EmployeeOnboardingService $onboardingService)
    {
    }

    public function index(Business $business): AnonymousResourceCollection
    {
        return EmployeeAdminResource::collection(
            $business->employees()->with(['user', 'services'])->get()
        );
    }

    public function store(StoreEmployeeRequest $request, Business $business): JsonResponse
    {
        $employee = $this->onboardingService->create($business, $request->validated());

        return response()->json(['employee' => new EmployeeAdminResource($employee)], 201);
    }

    public function destroy(Business $business, Employee $employee): JsonResponse
    {
        if ($employee->business_id !== $business->id) {
            return response()->json(['message' => 'این کارمند متعلق به این کسب‌وکار نیست.'], 404);
        }

        $employee->update(['is_active' => false]);

        return response()->json(['message' => 'دسترسی کارمند غیرفعال شد.']);
    }
}