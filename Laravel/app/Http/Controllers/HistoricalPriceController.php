<?php

namespace App\Http\Controllers;

use App\Services\CryptoCompareService;
use Carbon\CarbonImmutable;

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

    /**
     * Affiche les prix quotidiens pour les 30 derniers jours.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function showLast30DaysPrices()
    {
        $today = CarbonImmutable::now();
        $dates = $today->subDays(30)->daysUntil($today);

        $prices = [];
        foreach ($dates as $date) {
            // GET usd and eur prices for each date
            $usdData = $this->cryptoCompareService->getDailyHistoricalData('ETH', 'USD', $date->format('Y-m-d'));
            $eurData = $this->cryptoCompareService->getDailyHistoricalData('ETH', 'EUR', $date->format('Y-m-d'));

            $prices[] = [
                'date' => $date->format('Y-m-d'),
                'usd' => $usdData['close'] ?? $usdData['open'] ?? null,
                'eur' => $eurData['close'] ?? $eurData['open'] ?? null,
            ];
        }

        return response()->json($prices);
    }
}
