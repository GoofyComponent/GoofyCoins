<?php

namespace App\Http\Controllers;

use App\Services\EtherscanService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;

class EthStatsController extends Controller
{
    private EtherscanService $etherscanService;

    public function __construct(EtherscanService $etherscanService)
    {
        $this->etherscanService = $etherscanService;
    }

    /**
     * Obtenir toutes les statistiques nécessaires pour le tableau de bord.
     */
    public function getStats(): JsonResponse
    {
        try {
            $address = auth()->user()->address_wallet;
            $ethPriceData = $this->etherscanService->getEthPrice();
            $balanceData = $this->etherscanService->getBalance($address); // Remplacez par votre adresse

            $ethPrice = (float) $ethPriceData['ethusd'];
            $balanceEth = $balanceData['balance_eth'];
            $balanceInUsd = $balanceEth * $ethPrice;

            return response()->json([
                'ethPrice' => $ethPrice, // Prix de l'ETH en USD
                'balanceEth' => $balanceEth, // Balance en ETH
                'balanceUsd' => $balanceInUsd, // Balance en USD
                'address' => $balanceData['address'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtenir les soldes journaliers d'une adresse entre deux dates.
     *
     * @param  string  $startDate  Date de début au format YYYY-MM-DD.
     * @param  string  $endDate  Date de fin au format YYYY-MM-DD.
     */
    public function getDailyBalances(string $startDate, string $endDate): JsonResponse
    {
        try {

            set_time_limit(300); // Temps d'exécution maximum de 5 minutes

            $address = auth()->user()->address_wallet;

            $startDate = CarbonImmutable::parse($startDate)->startOfDay();
            $endDate = CarbonImmutable::parse($endDate)->endOfDay();

            // Récupérer le solde initial
            $balanceData = $this->etherscanService->getBalance($address);
            $initialBalance = $balanceData['balance'];

            // Récupérer les transactions
            $transactions = $this->etherscanService->getTransactions($address, $startDate, $endDate);

            // Calculer les soldes journaliers
            $dailyBalances = $this->etherscanService->calculateDailyBalances($transactions, $initialBalance, $address);

            return response()->json($dailyBalances);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
