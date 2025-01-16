<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
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
