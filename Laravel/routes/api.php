<?php

use App\Http\Controllers\EthStatsController;
use App\Http\Controllers\HistoricalPriceController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('eth')->middleware(['auth:sanctum', 'ensure_wallet_address'])->group(function () {
    Route::get('/stats', [EthStatsController::class, 'getStats']);
    Route::get('/balances/{startDate}/{endDate}', [EthStatsController::class, 'getDailyBalances']);
});

Route::middleware(['auth:sanctum'])->post('/user/store_address_wallet', [UserController::class, 'store_address_wallet']);

Route::middleware(['auth:sanctum'])->get('/daily-price/{date}', [HistoricalPriceController::class, 'showDailyPrice']);

Route::middleware(['auth:sanctum'])->get('/last-30-days-prices', [HistoricalPriceController::class, 'showLast30DaysPrices']);

require __DIR__.'/auth.php';
