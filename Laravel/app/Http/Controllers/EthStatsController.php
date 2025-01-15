<?php

namespace App\Http\Controllers;

use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use App\Services\EtherscanService;

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
            $ethPriceData = $this->etherscanService->getEthPrice();
            $balanceData = $this->etherscanService->getBalance('0x53e3a3BC2762a5f683751dE3Efe1BDf9631008C4'); // Remplacez par votre adresse

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
     */
    public function getDailyBalances(string $startDate, string $endDate): JsonResponse
    {
        try {
            set_time_limit(300); // Temps d'exécution maximum de 5 minutes

            $startDate = CarbonImmutable::parse($startDate)->startOfDay();
            $endDate = CarbonImmutable::parse($endDate)->endOfDay();
            $address = '0x53e3a3BC2762a5f683751dE3Efe1BDf9631008C4'; // Adresse cible

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
