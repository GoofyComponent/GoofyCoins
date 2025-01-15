<?php

namespace App\Http\Controllers;

use App\Services\CryptoCompareService;

class HistoricalPriceController extends Controller
{
    private $cryptoCompareService;

    public function __construct(CryptoCompareService $cryptoCompareService)
    {
        $this->cryptoCompareService = $cryptoCompareService;
    }

    /**
     * Affiche le prix quotidien pour une date donnée.
     *
     * @param  string  $date  Date au format YYYY-MM-DD.
     * @return \Illuminate\Http\JsonResponse
     */
    public function showDailyPrice(string $date)
    {
        try {
            $data = $this->cryptoCompareService->getDailyHistoricalData('ETH', 'USD', $date);

            return response()->json([
                'date' => $date,
                'data' => $data,
                'price' => $data['close'] ?? $data['open'] ?? null,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
