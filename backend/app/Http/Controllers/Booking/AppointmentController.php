<?php

namespace App\Http\Controllers\Booking;

use App\Exceptions\SlotUnavailableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Employee;
use App\Models\Service;
use App\Services\Booking\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(private readonly BookingService $bookingService)
    {
    }

    public function myAppointments(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $appointments = Appointment::query()
            ->where('customer_id', $request->user()->id)
            ->with(['service', 'employee.user', 'business'])
            ->latest('appointment_date')
            ->paginate(10);

        return AppointmentResource::collection($appointments);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $employee = Employee::findOrFail($request->integer('employee_id'));
        $service = Service::findOrFail($request->integer('service_id'));

        try {
            $appointment = $this->bookingService->book(
                $request->user(),
                $employee,
                $service,
                $request->string('date')->toString(),
                $request->string('start_time')->toString().':00'
            );
        } catch (SlotUnavailableException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json([
            'appointment' => new AppointmentResource($appointment),
        ], 201);
    }

    public function cancel(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'شما اجازه لغو این نوبت را ندارید.'], 403);
        }

        $appointment = $this->bookingService->cancel($appointment);

        return response()->json(['appointment' => new AppointmentResource($appointment)]);
    }
}