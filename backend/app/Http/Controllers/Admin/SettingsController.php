<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show(Business $business): JsonResponse
    {
        return response()->json([
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
                'slug' => $business->slug,
                'description' => $business->description,
                'address' => $business->address,
                'phone' => $business->phone,
                'timezone' => $business->timezone,
                'is_active' => $business->is_active,
            ],
        ]);
    }

    public function update(Request $request, Business $business): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'address' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:20'],
            'timezone' => ['sometimes', 'string', 'max:50'],
        ]);

        $business->update($validated);

        return response()->json([
            'message' => 'تنظیمات با موفقیت بروزرسانی شد.',
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
                'slug' => $business->slug,
                'description' => $business->description,
                'address' => $business->address,
                'phone' => $business->phone,
                'timezone' => $business->timezone,
                'is_active' => $business->is_active,
            ],
        ]);
    }
}
