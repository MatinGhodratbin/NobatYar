<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // محدودیت عمومی برای کل API: هر کاربر (یا IP در صورت مهمان) ۶۰ درخواست در دقیقه
        RateLimiter::for('api', function ($request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // محدودیت سخت‌گیرانه برای عملیات حساس احراز هویت (جایگزین throttle:6,1 پراکنده در routes)
        RateLimiter::for('auth-sensitive', function ($request) {
            return Limit::perMinute(6)->by($request->ip());
        });
    }
}