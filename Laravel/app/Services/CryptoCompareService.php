<?php

namespace App\Services;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CryptoCompareService
{
    private string $apiUrl;

    private string $apiKey;

    public function __construct()
    {
        $this->apiUrl = config('services.cryptocompare.api_url', env('CRYPTOCOMPARE_API_URL'));
        $this->apiKey = config('services.cryptocompare.api_key', env('CRYPTOCOMPARE_API_KEY'));
    }

    /**
     * Récupère les données historiques quotidiennes pour une paire donnée.
     *
     * @param  string  $fsym  Symbole de la cryptomonnaie (ex: ETH).
     * @param  string  $tsym  Symbole de la devise cible (ex: USD).
     * @param  string  $date  Date au format YYYY-MM-DD.
     * @param  int  $limit  Nombre de jours à inclure (optionnel, par défaut 1).
     *
     * @throws \Exception
     */
    public function getDailyHistoricalData(string $fsym, string $tsym, string $date, int $limit = 2000): ?array
    {
        // Clé unique pour le cache
        $cacheKey = "cryptocompare:daily:$fsym:$tsym:$date";

        // Vérifier si les données sont déjà en cache
        return Cache::remember($cacheKey, now()->addDays(30), function () use ($fsym, $tsym, $date, $limit) {
            // Convertir la date en timestamp Unix
            $timestamp = CarbonImmutable::parse($date)->startOfDay()->timestamp;

            $response = Http::withHeaders([
                'authorization' => 'Apikey '.$this->apiKey,
            ])->get($this->apiUrl.'/histoday', [
                'fsym' => $fsym, // From Symbol
                'tsym' => $tsym, // To Symbol
                'limit' => $limit, // Nombre de jours à inclure
                'toTs' => $timestamp, // Timestamp de fin
            ]);

            if ($response->failed()) {
                throw new \Exception('Failed to fetch historical data: '.$response->body());
            }

            $data = $response->json();

            if ($data['Response'] !== 'Success') {
                throw new \Exception('Error from CryptoCompare API: '.($data['Message'] ?? 'Unknown error'));
            }

            // Chercher la date spécifique dans les données
            foreach ($data['Data']['Data'] as $key => $value) {
                if ($value['time'] == $timestamp) {
                    return $value; // Retourne les données historiques pour la date donnée
                }
            }

            return null;
        });
    }
}
