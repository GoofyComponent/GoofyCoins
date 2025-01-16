<?php

namespace App\Services;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class EtherscanService
{
    private string $apiUrl;

    private string $apiKey;

    private CryptoCompareService $cryptoCompareService;

    public function __construct()
    {
        $this->apiUrl = config('services.etherscan.api_url', env('ETHERSCAN_API_URL'));
        $this->apiKey = config('services.etherscan.api_key', env('ETHERSCAN_API_KEY'));
        $this->cryptoCompareService = new CryptoCompareService;
    }

    /**
     * Récupère le solde d'une adresse sur la chaîne Ethereum.
     *
     * @throws \Exception
     */
    public function getBalance(string $address, string $tag = 'latest'): array
    {
        $cacheKey = "etherscan:balance:$address:$tag:$address";

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($address, $tag) {
            $response = Http::get($this->apiUrl, [
                'module' => 'account',
                'action' => 'balance',
                'address' => $address,
                'tag' => $tag,
                'apikey' => $this->apiKey,
                'chainid' => 1,
            ]);

            if ($response->failed()) {
                throw new \Exception('Failed to fetch balance from Etherscan: '.$response->body());
            }

            $data = $response->json();

            if ($data['status'] !== '1') {
                throw new \Exception('Error from Etherscan API: '.$data['result']);
            }

            return [
                'address' => $address,
                'balance' => $data['result'],
                'balance_eth' => $this->wei2eth($data['result']),
            ];
        });
    }

    /**
     * Récupère le prix actuel de l'ETH.
     *
     * @throws \Exception
     */
    public function getEthPrice(): array
    {
        $cacheKey = 'etherscan:ethprice';

        return Cache::remember($cacheKey, now()->addMinutes(10), function () {
            $response = Http::get($this->apiUrl, [
                'module' => 'stats',
                'action' => 'ethprice',
                'apikey' => $this->apiKey,
                'chainid' => 1,
            ]);

            if ($response->failed()) {
                throw new \Exception('Failed to fetch ETH price: '.$response->body());
            }

            $data = $response->json();

            if ($data['status'] !== '1') {
                throw new \Exception('Error from Etherscan API: '.$data['result']);
            }

            return $data['result'];
        });
    }

    /**
     * Récupère les transactions d'une adresse entre deux dates.
     *
     * @param  string  $startDate  Format YYYY-MM-DD
     * @param  string  $endDate  Format YYYY-MM-DD
     *
     * @throws \Exception
     */
    public function getTransactions(string $address, CarbonImmutable $startDate, CarbonImmutable $endDate): array
    {
        $transactions = [];
        $page = 1;
        $offset = 100; // Nombre de transactions par page

        $actions = ['txlist', 'txlistinternal']; // Actions à effectuer pour récupérer les transactions normales et internes

        foreach ($actions as $action) {
            $page = 1; // Réinitialiser la pagination pour chaque type d'action

            do {
                $response = Http::get($this->apiUrl, [
                    'module' => 'account',
                    'action' => $action,
                    'address' => $address,
                    'startblock' => 0,
                    'endblock' => 99999999,
                    'sort' => 'desc',
                    'apikey' => $this->apiKey,
                    'chainid' => 1,
                    'page' => $page,
                    'offset' => $offset,
                ]);

                if ($response->failed()) {
                    throw new \Exception('Failed to fetch transactions from Etherscan: '.$response->body());
                }

                $data = $response->json();

                if (! isset($data['status']) || $data['status'] !== '1') {
                    // Si le message indique "No transactions found", on arrête.
                    if (isset($data['message']) && $data['message'] === 'No transactions found') {
                        break;
                    }

                    throw new \Exception('Error from Etherscan API: '.($data['result'] ?? 'Unknown error'));
                }

                foreach ($data['result'] as $tx) {
                    $txDate = CarbonImmutable::createFromTimestamp($tx['timeStamp']);

                    // Si la transaction est hors de la plage de dates, on arrête le processus.
                    if ($txDate->lt($startDate)) {
                        return $transactions;
                    }

                    // Ajouter la transaction si elle est dans la plage de dates spécifiée.
                    if ($txDate->isBetween($startDate, $endDate)) {
                        $transactions[] = $tx;
                    }
                }

                $page++;
            } while (count($data['result']) === $offset); // Continuer tant que la page est pleine.
        }

        return $transactions;
    }

    /**
     * Regroupe les transactions par jour et calcule les soldes journaliers.
     *
     * @param  float  $initialBalance
     */
    public function calculateDailyBalances(array $transactions, string $initialBalance, string $address): array
    {
        $dailyBalances = [];

        // Regrouper les transactions par jour
        $transactionsByDay = collect($transactions)->groupBy(function ($tx) {
            return CarbonImmutable::createFromTimestamp($tx['timeStamp'])->toDateString();
        });

        // Initialiser le solde courant
        $currentBalance = $initialBalance;

        // Calculer les soldes journaliers
        foreach ($transactionsByDay as $date => $txs) {
            $dailyBalance = $currentBalance;

            foreach ($txs as $tx) {
                if (Str::upper($tx['from']) === Str::upper($address)) { // Vérifier si l'adresse est l'expéditeur OUT
                    $dailyBalance = $dailyBalance + $tx['value'] + $tx['gasUsed'] * $tx['gasPrice'];
                } elseif (Str::upper($tx['to']) === Str::upper($address)) { // Vérifier si l'adresse est le destinataire IN
                    $dailyBalance = $dailyBalance - $tx['value'];
                }
            }

            $USD = $this->cryptoCompareService->getDailyHistoricalData('ETH', 'USD', $date);
            $EUR = $this->cryptoCompareService->getDailyHistoricalData('ETH', 'EUR', $date);

            $usdPrice = $USD['close'] ?? $USD['open'] ?? 0;
            $eurPrice = $EUR['close'] ?? $EUR['open'] ?? 0;

            $dailyBalances[$date] = [
                'eth' => $this->wei2eth($dailyBalance),
                'usd' => $this->wei2eth($dailyBalance) * $usdPrice,
                'eur' => $this->wei2eth($dailyBalance) * $eurPrice,
                'eth_usd_price' => $usdPrice,
                'eth_eur_price' => $eurPrice,
            ];

            $currentBalance = $dailyBalance;
        }

        $today = CarbonImmutable::now()->toDateString();
        if (isset($dailyBalances[$today])) {
            $dailyBalances[$today] = [
                'eth' => $this->wei2eth($initialBalance),
                'usd' => $this->wei2eth($initialBalance) * $usdPrice,
                'eur' => $this->wei2eth($initialBalance) * $eurPrice,
                'eth_usd_price' => $usdPrice,
                'eth_eur_price' => $eurPrice,
            ];
        }

        return $dailyBalances;
    }

    private function wei2eth($wei)
    {
        try {
            // Convertir le wei en chaîne pour gérer les notations scientifiques
            $wei = is_numeric($wei) ? sprintf('%.0f', $wei) : $wei;

            return bcdiv($wei, '1000000000000000000', 18);
        } catch (\ValueError $e) {
            throw new \Exception('Failed to convert wei to eth: Invalid value provided - '.$wei);
        } catch (\Exception $e) {
            throw new \Exception('Failed to convert wei to eth: '.$e->getMessage());
        }
    }
}
