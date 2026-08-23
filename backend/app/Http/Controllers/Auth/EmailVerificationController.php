<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function verify(EmailVerificationRequest $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'ایمیل قبلاً تأیید شده است.']);
        }

        $request->fulfill();

        return response()->json(['message' => 'ایمیل با موفقیت تأیید شد.']);
    }

    public function resend(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'ایمیل قبلاً تأیید شده است.']);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'لینک تأیید مجدداً ارسال شد.']);
    }
}