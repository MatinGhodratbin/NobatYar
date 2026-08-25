<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAppointmentStatusRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Business;
use App\Services\Booking\BookingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class AdminAppointmentController extends Controller
{
    public function __construct(private readonly BookingService $bookingService)
    {
    }

    public function index(Request $request, Business $business): AnonymousResourceCollection
    {
        $employee = $business->employees()->where('user_id', $request->user()->id)->first();
        $isOwner = $request->attributes->get('is_business_owner');

        $appointments = Appointment::query()
            ->where('business_id', $business->id)
            ->when(! $isOwner && $employee, fn ($q) => $q->where('employee_id', $employee->id))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('date'), fn ($q, $date) => $q->whereDate('appointment_date', $date))
            ->when($request->query('search'), function ($q, $search) {
                $q->whereHas('customer', fn ($cq) => $cq->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%"));
            })
            ->with(['service', 'employee.user', 'customer'])
            ->latest('appointment_date')
            ->paginate(15);

        return AppointmentResource::collection($appointments);
    }

    public function updateStatus(
        UpdateAppointmentStatusRequest $request,
        Business $business,
        Appointment $appointment
    ): JsonResponse {
        if ($appointment->business_id !== $business->id) {
            return response()->json(['message' => 'این نوبت متعلق به این کسب‌وکار نیست.'], 404);
        }

        $isOwner = $request->attributes->get('is_business_owner');
        $employee = $business->employees()->where('user_id', $request->user()->id)->first();

        if (! $isOwner && (! $employee || $employee->id !== $appointment->employee_id)) {
            return response()->json(['message' => 'شما اجازه‌ی تغییر این نوبت را ندارید.'], 403);
        }

        $appointment = $this->bookingService->updateStatus($appointment, $request->validated()['status']);

        return response()->json(['appointment' => new AppointmentResource($appointment)]);
    }
}