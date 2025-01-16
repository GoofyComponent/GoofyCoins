<?php

use App\Http\Controllers\EthStatsController;
use App\Http\Controllers\HistoricalPriceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('eth')->group(function () {
    Route::get('/stats', [EthStatsController::class, 'getStats']);
    Route::get('/balances/{startDate}/{endDate}', [EthStatsController::class, 'getDailyBalances']);
});

Route::middleware(['auth:sanctum'])->get('/daily-price/{date}', [HistoricalPriceController::class, 'showDailyPrice']);

Route::middleware(['auth:sanctum'])->get('/last-30-days-prices', [HistoricalPriceController::class, 'showLast30DaysPrices']);

require __DIR__.'/auth.php';
