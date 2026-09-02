<?php

namespace App\Http\Requests\Booking;

use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === \App\Enums\UserRole::Customer;
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->any()) {
                return;
            }

            $employee = Employee::find($this->input('employee_id'));
            if (! $employee) {
                return;
            }

            $timezone = $employee->business->timezone ?? 'UTC';
            $today = Carbon::today($timezone)->toDateString();

            if ($this->input('date') < $today) {
                $validator->errors()->add('date', 'تاریخ نمی‌تواند در گذشته باشد.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'authorize' => 'فقط مشتریان می‌توانند نوبت ثبت کنند.',
        ];
    }
}
