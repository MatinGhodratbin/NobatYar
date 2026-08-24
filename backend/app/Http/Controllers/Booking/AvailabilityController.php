<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\AvailableSlotsRequest;
use App\Models\Employee;
use App\Models\Service;
use App\Services\Booking\AvailabilityService;
use Illuminate\Http\JsonResponse;

class AvailabilityController extends Controller
{
    public function __construct(private readonly AvailabilityService $availabilityService)
    {
    }

    public function __invoke(AvailableSlotsRequest $request): JsonResponse
    {
        $employee = Employee::findOrFail($request->integer('employee_id'));
        $service = Service::findOrFail($request->integer('service_id'));

        $slots = $this->availabilityService->getAvailableSlots(
            $employee,
            $service,
            $request->string('date')->toString()
        );

        return response()->json([
            'date' => $request->string('date')->toString(),
            'slots' => $slots,
        ]);
    }
}