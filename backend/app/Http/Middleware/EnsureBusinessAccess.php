<?php

namespace App\Http\Middleware;

use App\Models\Business;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBusinessAccess
{
    /**
     * پارامتر $level: 'owner' یعنی فقط مالک، 'any' یعنی مالک یا کارمند همان کسب‌وکار.
     */
    public function handle(Request $request, Closure $next, string $level = 'any'): Response
    {
        $business = $request->route('business');

        if (! $business instanceof Business) {
            return response()->json(['message' => 'کسب‌وکار یافت نشد.'], 404);
        }

        $user = $request->user();
        $isOwner = (int) $business->owner_id === (int) $user->id;
        $isEmployee = $business->employees()->where('user_id', $user->id)->exists();

        if ($level === 'owner' && ! $isOwner) {
            return response()->json(['message' => 'فقط مالک کسب‌وکار به این بخش دسترسی دارد.'], 403);
        }

        if ($level === 'any' && ! $isOwner && ! $isEmployee) {
            return response()->json(['message' => 'شما به این کسب‌وکار دسترسی ندارید.'], 403);
        }

        $request->attributes->set('is_business_owner', $isOwner);

        return $next($request);
    }
}