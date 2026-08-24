<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SanitizeInput
{
    /**
     * فیلدهایی که نباید strip_tags بشن (چون خودشون رمز/توکن‌اند و تگ توشون معنی نداره ولی حساسیت داده مهمه)
     */
    private array $except = ['password', 'password_confirmation', 'token'];

    public function handle(Request $request, Closure $next)
    {
        $sanitized = $this->sanitize($request->all());
        $request->merge($sanitized);

        return $next($request);
    }

    private function sanitize(array $input): array
    {
        foreach ($input as $key => $value) {
            if (is_array($value)) {
                $input[$key] = $this->sanitize($value);
                continue;
            }

            if (is_string($value) && ! in_array($key, $this->except, true)) {
                $input[$key] = trim(strip_tags($value));
            }
        }

        return $input;
    }
}