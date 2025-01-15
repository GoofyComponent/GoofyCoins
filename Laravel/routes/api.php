<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EthStatsController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('eth')->group(function () {
    Route::get('/stats', [EthStatsController::class, 'getStats']);
    Route::get('/balances/{startDate}/{endDate}', [EthStatsController::class, 'getDailyBalances']);
});

require __DIR__ . '/auth.php';
