<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class EnsureRefreshToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier le token d'authentification
        $authToken = $request->bearerToken();
        $token = $authToken ? $this->retrieveToken($authToken) : null;

        // Si le token est valide et non expiré, continuer
        if ($token && !$this->isTokenExpired($token)) {
            Auth::login($token->tokenable);
            return $next($request);
        }

        // Vérifier le refresh token uniquement si l'auth token est invalide ou expiré
        $refreshTokenValue = $request->cookie('refresh_token');
        $refreshToken = $refreshTokenValue ? $this->retrieveToken($refreshTokenValue) : null;

        // Si le refresh token est valide et non expiré, générer un nouveau auth token UNIQUEMENT SI nécessaire
        if ($refreshToken && !$this->isTokenExpired($refreshToken)) {
            if ($token) {
                $token->delete(); // Supprime le token expiré
            }

            // Vérifie si un auth_token existe déjà pour éviter de recréer un token inutilement
            $existingToken = $this->getExistingAuthToken($refreshToken->tokenable);
            if (!$existingToken || $this->isTokenExpired($existingToken)) {
                $this->generateNewAuthToken($refreshToken);
            }

            Auth::login($refreshToken->tokenable);
            return $next($request);
        }

        // Aucun token valide, renvoyer une erreur 401
        return $this->unauthorizedResponse();
    }

    /**
     * Vérifie si un token est expiré.
     */
    private function isTokenExpired(PersonalAccessToken $token): bool
    {
        // Si expires_at est nul, le token n'expire jamais
        if (is_null($token->expires_at)) {
            return false;
        }

        // Sinon, vérifier si le token est expiré
        return Carbon::now()->greaterThanOrEqualTo($token->expires_at);
    }

    /**
     * Récupère un token à partir de sa valeur.
     */
    private function retrieveToken(string $token): ?PersonalAccessToken
    {
        [$id, $plainTextToken] = explode('|', $token, 2);

        return PersonalAccessToken::find($id);
    }

    /**
     * Génère un nouveau auth token et le stocke dans les cookies.
     */
    private function generateNewAuthToken(PersonalAccessToken $refreshToken): void
    {
        $newToken = $refreshToken->tokenable->createToken('auth_token')->plainTextToken;

        cookie()->queue(cookie('auth_token', $newToken, 60 * 24, null, null, false, true));
    }

    /**
     * Retourne une réponse 401 Unauthorized.
     */
    private function unauthorizedResponse(): Response
    {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    /**
     * Récupère un auth token existant pour un utilisateur.
     */
    private function getExistingAuthToken($user): ?PersonalAccessToken
    {
        return $user->tokens()
            ->where('name', 'auth_token')
            ->latest('created_at')
            ->first();
    }
}
