<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Employee;
use App\Models\WorkingHour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkingHoursController extends Controller
{
    public function index(Request $request, Business $business): JsonResponse
    {
        $employee = $business->employees()->where('user_id', $request->user()->id)->first();
        $isOwner = $request->attributes->get('is_business_owner');

        $employees = $isOwner
            ? $business->employees()->with('workingHours')->get()
            : Employee::where('id', $employee?->id)->with('workingHours')->get();

        return response()->json([
            'employees' => $employees->map(fn ($e) => [
                'id' => $e->id,
                'name' => $e->user->name,
                'working_hours' => $e->workingHours->map(fn ($wh) => [
                    'id' => $wh->id,
                    'day_of_week' => $wh->day_of_week,
                    'start_time' => $wh->start_time,
                    'end_time' => $wh->end_time,
                    'is_day_off' => $wh->is_day_off,
                ]),
            ]),
        ]);
    }

    public function update(Request $request, Business $business, Employee $employee): JsonResponse
    {
        if ($employee->business_id !== $business->id) {
            return response()->json(['message' => 'این کارمند متعلق به این کسب‌وکار نیست.'], 404);
        }

        $validated = $request->validate([
            'hours' => ['required', 'array', 'size:7'],
            'hours.*.day_of_week' => ['required', 'integer', 'min:0', 'max:6'],
            'hours.*.start_time' => ['nullable', 'string'],
            'hours.*.end_time' => ['nullable', 'string'],
            'hours.*.is_day_off' => ['boolean'],
        ]);

        foreach ($validated['hours'] as $hour) {
            WorkingHour::updateOrCreate(
                ['employee_id' => $employee->id, 'day_of_week' => $hour['day_of_week']],
                [
                    'start_time' => $hour['is_day_off'] ? null : ($hour['start_time'] ?? '09:00'),
                    'end_time' => $hour['is_day_off'] ? null : ($hour['end_time'] ?? '17:00'),
                    'is_day_off' => $hour['is_day_off'] ?? false,
                ]
            );
        }

        return response()->json(['message' => 'ساعات کاری بروزرسانی شد.']);
    }
}
