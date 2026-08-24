<?php

use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Booking\AppointmentController;
use App\Http\Controllers\Booking\AvailabilityController;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->prefix('booking')->group(function () {
    Route::get('availability', AvailabilityController::class);
    Route::get('services', [\App\Http\Controllers\Catalog\ServiceController::class, 'index']);
    Route::get('employees', [\App\Http\Controllers\Catalog\EmployeeController::class, 'index']);
    Route::post('appointments', [AppointmentController::class, 'store']);
    Route::post('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
});