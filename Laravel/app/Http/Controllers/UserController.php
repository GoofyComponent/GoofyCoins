<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function update_username(Request $request) : \Illuminate\Http\JsonResponse
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        if (!$request->name) {
            return response()->json(['error' => 'Username is required'], 400);
        }
        $user->name = $request->name;
        $user->save();
        return response()->json(['message' => 'Username updated successfully'], 200);
    }

    public function update_email(Request $request) : \Illuminate\Http\JsonResponse
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        if (!$request->email) {
            return response()->json(['error' => 'Email is required'], 400);
        }
        $user->email = $request->email;
        $user->save();
        return response()->json(['message' => 'Email updated successfully'], 200);
    }

    public function update_password(Request $request) : \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'old_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'password_confirmation' => ['required', 'string'],
        ]);

        if ($request->password !== $request->password_confirmation) {
            return response()->json(['error' => 'Password and confirm password do not match'], 400);
        }

        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['error' => 'Old password is incorrect'], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json(['message' => 'Password updated successfully'], 200);
    }

    /**
     * Store the user's Etherscan API wallet address.
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function store_address_wallet(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'address_wallet' => 'required|string',
        ]);

        $user = auth()->user();
        $user->address_wallet = $request->address_wallet;
        $user->save();

        return response()->json(['message' => 'Etherscan API wallet saved successfully'], 200);
    }
}
