<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\Booking\QueueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function __construct(private readonly QueueService $queueService)
    {
    }

    public function show(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'شما اجازه‌ی مشاهده این نوبت را ندارید.'], 403);
        }

        return response()->json([
            'appointment_id' => $appointment->id,
            'status' => $appointment->status,
            'people_ahead' => $this->queueService->peopleAhead($appointment),
            'estimated_minutes' => $this->queueService->estimatedWaitMinutes($appointment),
            'progress_percent' => $this->queueService->progressPercent($appointment),
        ]);
    }
}