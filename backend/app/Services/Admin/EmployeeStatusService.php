<?php

namespace App\Services\Admin;

use App\Events\EmployeeStatusUpdated;
use App\Models\Employee;

class EmployeeStatusService
{
    public function updateStatus(Employee $employee, string $status): Employee
    {
        $employee->update(['status' => $status]);

        broadcast(new EmployeeStatusUpdated($employee));

        return $employee->fresh();
    }
}