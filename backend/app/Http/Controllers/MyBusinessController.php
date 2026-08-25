<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyBusinessController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $business = Business::where('owner_id', $user->id)->first();

        if (! $business) {
            $employee = $user->employeeProfile;
            $business = $employee?->business;
        }

        if (! $business) {
            return response()->json(['message' => 'هیچ کسب‌وکاری برای این کاربر یافت نشد.'], 404);
        }

        return response()->json(['business' => ['id' => $business->id, 'name' => $business->name]]);
    }
}