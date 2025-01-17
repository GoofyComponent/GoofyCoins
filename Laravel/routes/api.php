<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EthStatsController;
use App\Http\Controllers\HistoricalPriceController;

Route::middleware(['custom_auth'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('eth')->middleware(['custom_auth', 'ensure_wallet_address'])->group(function () {
    Route::get('/stats', [EthStatsController::class, 'getStats']);
    Route::get('/balances/{startDate}/{endDate}', [EthStatsController::class, 'getDailyBalances']);
});

Route::middleware(['custom_auth'])->post('/user/store_address_wallet', [UserController::class, 'store_address_wallet']);

Route::middleware(['custom_auth'])->get('/daily-price/{date}', [HistoricalPriceController::class, 'showDailyPrice']);

Route::middleware(['custom_auth'])->get('/last-30-days-prices', [HistoricalPriceController::class, 'showLast30DaysPrices']);

require __DIR__ . '/auth.php';
