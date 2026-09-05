<?php

use App\Http\Controllers\Admin\AdminAppointmentController;
use App\Http\Controllers\Admin\AdminEmployeeController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\WorkingHoursController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Booking\AppointmentController;
use App\Http\Controllers\Booking\AvailabilityController;
use App\Http\Controllers\Booking\QueueController;
use App\Http\Controllers\Catalog\EmployeeController;
use App\Http\Controllers\Catalog\ServiceController;
use App\Http\Controllers\MyBusinessController;
use App\Http\Controllers\Onboarding\BusinessOnboardingController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| احراز هویت (فاز ۲ و ۳)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('register', RegisterController::class)
        ->middleware('throttle:auth-sensitive');

    Route::post('login', [LoginController::class, 'login'])
        ->middleware('throttle:auth-sensitive');

    Route::post('forgot-password', [PasswordResetController::class, 'forgot'])
        ->middleware('throttle:auth-sensitive');

    Route::post('reset-password', [PasswordResetController::class, 'reset'])
        ->middleware('throttle:auth-sensitive');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [LoginController::class, 'logout']);
        Route::get('user', [UserController::class, 'me']);

        Route::post('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->middleware('signed')
            ->name('verification.verify');

        Route::post('email/resend', [EmailVerificationController::class, 'resend'])
            ->middleware('throttle:auth-sensitive');
    });
});

/*
|--------------------------------------------------------------------------
| احراز هویت کانال‌های Broadcasting (فاز ۶)
|--------------------------------------------------------------------------
*/
Broadcast::routes(['middleware' => ['auth:sanctum']]);

/*
|--------------------------------------------------------------------------
| کاتالوگ عمومی + کسب‌وکار کاربر + Onboarding (فاز ۵، ۷.۲، ۷.۳)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('businesses', [\App\Http\Controllers\Catalog\BusinessController::class, 'index']);
    Route::get('businesses/{slug}', [\App\Http\Controllers\Catalog\BusinessController::class, 'show']);
    Route::get('services', [ServiceController::class, 'index']);
    Route::get('employees', [EmployeeController::class, 'index']);    Route::get('my-business', MyBusinessController::class);
    Route::post('business/onboarding', [BusinessOnboardingController::class, 'store']);
    Route::patch('my-employee/status', [\App\Http\Controllers\MyEmployeeStatusController::class, 'update']);
});

/*
|--------------------------------------------------------------------------
| رزرو نوبت (فاز ۴ و ۶)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('booking')->group(function () {
    Route::get('availability', AvailabilityController::class);
    Route::get('my-appointments', [AppointmentController::class, 'myAppointments']);
    Route::post('appointments', [AppointmentController::class, 'store']);
    Route::post('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::get('appointments/{appointment}/queue', [QueueController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| پنل ادمین (فاز ۷.۱)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('admin/businesses/{business}')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'show'])
        ->middleware('business.access:owner');

    Route::get('appointments', [AdminAppointmentController::class, 'index'])
        ->middleware('business.access:any');
    Route::patch('appointments/{appointment}/status', [AdminAppointmentController::class, 'updateStatus'])
        ->middleware('business.access:any');
    Route::put('appointments/{appointment}/notes', [AdminAppointmentController::class, 'updateNotes'])
        ->middleware('business.access:any');

    Route::middleware('business.access:owner')->group(function () {
        Route::get('services', [AdminServiceController::class, 'index']);
        Route::post('services', [AdminServiceController::class, 'store']);
        Route::put('services/{service}', [AdminServiceController::class, 'update']);
        Route::delete('services/{service}', [AdminServiceController::class, 'destroy']);

        Route::get('employees', [AdminEmployeeController::class, 'index']);
        Route::post('employees', [AdminEmployeeController::class, 'store']);
        Route::put('employees/{employee}', [AdminEmployeeController::class, 'update']);
        Route::delete('employees/{employee}', [AdminEmployeeController::class, 'destroy']);

        Route::get('settings', [SettingsController::class, 'show']);
        Route::put('settings', [SettingsController::class, 'update']);

        Route::get('working-hours', [WorkingHoursController::class, 'index']);
        Route::put('working-hours/{employee}', [WorkingHoursController::class, 'update']);
    });
});