<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ]);

        if (! Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        /** @var User $user */
        $user = $request->user();
        $token = $user->createToken($credentials['device_name'] ?? 'web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->transformUser($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->transformUser($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out',
        ]);
    }

    protected function transformUser(?User $user): array
    {
        if (! $user) {
            return [];
        }

        $user->loadMissing('agent');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'agent' => $user->agent ? [
                'id' => $user->agent->id,
                'full_name' => $user->agent->full_name,
                'developer_id' => $user->agent->developer_id,
            ] : null,
        ];
    }
}
