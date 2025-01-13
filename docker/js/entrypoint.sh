#!/bin/bash

echo ""
echo "***********************************************************"
echo "   Starting React Development Server                       "
echo "***********************************************************"

set -e

info() {
    echo "[INFO] $@"
}

warning() {
    echo "[WARNING] $@"
}

fatal() {
    echo "[ERROR] $@" >&2
    exit 1
}

# Installation des dépendances
info "Running npm install to ensure dependencies are up-to-date..."
npm install

# Démarrage du serveur de développement
info "Starting Vite development server..."
exec npm run dev