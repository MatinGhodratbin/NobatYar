<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;

class RegisterController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    public function __invoke(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->register($request->validated());

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }
}