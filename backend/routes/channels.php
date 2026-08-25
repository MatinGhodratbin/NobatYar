<?php

use App\Models\Appointment;
use App\Models\Business;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// فقط مشتری صاحب نوبت اجازه‌ی گوش‌دادن به این کانال رو داره
Broadcast::channel('appointment.{appointmentId}', function ($user, $appointmentId) {
    $appointment = Appointment::find($appointmentId);

    return $appointment && (int) $appointment->customer_id === (int) $user->id;
});

// فقط مالک کسب‌وکار یا کارمندهای همون کسب‌وکار اجازه دارن (کارمند از فاز ۲ نقش employee داره)
Broadcast::channel('business.{businessId}.queue', function ($user, $businessId) {
    $business = Business::find($businessId);

    if (! $business) {
        return false;
    }

    if ((int) $business->owner_id === (int) $user->id) {
        return true;
    }

    return $business->employees()->where('user_id', $user->id)->exists();
});