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

    public function update(\App\Http\Requests\Admin\StoreEmployeeRequest $request, Business $business, Employee $employee): JsonResponse
    {
        if ($employee->business_id !== $business->id) {
            return response()->json(['message' => 'این کارمند متعلق به این کسب‌وکار نیست.'], 404);
        }

        $employee->update([
            'position' => $request->input('position', $employee->position),
        ]);

        if ($employee->user) {
            $employee->user->update([
                'name' => $request->input('name', $employee->user->name),
                'phone' => $request->input('phone', $employee->user->phone),
            ]);
        }

        if ($request->has('service_ids')) {
            $employee->services()->sync($request->input('service_ids', []));
        }

        return response()->json(['employee' => new EmployeeAdminResource($employee->load(['user', 'services']))]);
    }
}