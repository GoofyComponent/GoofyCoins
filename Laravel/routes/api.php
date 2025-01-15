<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware(['auth:sanctum'])->post('/user/etherscan_api_key', 'UserController@store_etherscan_api_key');

require __DIR__ . '/auth.php';
