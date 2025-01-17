<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login credentials'], 401);
        }

        $user = Auth::user();

        // Créer les tokens
        $authToken = $user->createToken('auth_token')->plainTextToken;
        $refreshToken = $user->createToken('refresh_token')->plainTextToken;

        return response()->json([
            'access_token' => $authToken,
            'token_type' => 'Bearer',
            'user' => $user,
            'status' => 'Login successful',
        ])->withCookie(cookie('refresh_token', $refreshToken, 60 * 24, null, null, false, true));
    }

    public function destroy(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['status' => 'Logged out']);
    }
}
