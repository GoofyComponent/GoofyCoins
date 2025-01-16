# README

## Description

Cette application est une solution web construite avec Laravel pour le backend et React pour le frontend. Elle permet d'afficher des statistiques détaillées sur un wallet Ethereum dans un tableau de bord interactif. L'application utilise Docker pour l'environnement de développement, simplifiant ainsi la gestion des dépendances et le déploiement.

---

## Prérequis

- [Docker](https://www.docker.com/) installé sur votre machine
- [Docker Compose](https://docs.docker.com/compose/) pour orchestrer les services

---

## Installation

### 1. Cloner le dépôt
```bash
git clone https://github.com/GoofyComponent/GoofyCoins
cd GoofyCoins
```

### 2. Lancer l'application
Démarrez l'environnement Docker avec :
```bash
make up
```

### 3. Installer les dépendances
Installez les dépendances backend et frontend :
```bash
make install
```

### 4. Configurer la base de données
Appliquez les migrations et les seeders :
```bash
make fresh
```

---

## Commandes Makefile

### Lancer et arrêter les services
- **`make up`** : Lance les containers Docker
- **`make down`** : Arrête et supprime les containers Docker

### Gestion des services
- **`make exec`** : Accède au container Laravel via bash

### Gestion des dépendances
- **`make install-back`** : Installe les dépendances backend via Composer
- **`make install-front`** : Installe les dépendances frontend via npm
- **`make install`** : Exécute `make install-back` et `make install-front`

### Maintenance et tests
- **`make pint`** : Lint le code backend avec Pint
- **`make fresh`** : Réinitialise la base de données avec les migrations et seeders
- **`make clear`** : Vide le cache de configuration Laravel
- **`make test`** : Exécute les tests PHPUnit

---

## Utilisation

1. Accédez à l'application en ouvrant votre navigateur à l'adresse : [http://localhost:3000](http://localhost:3000)
2. Naviguez dans le tableau de bord pour visualiser les statistiques du wallet Ethereum.

---

## Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Effectuez vos changements
4. Commitez vos modifications (`git commit -m 'Ajout de ma fonctionnalité'`)
5. Poussez votre branche (`git push origin feature/ma-fonctionnalite`)
6. Ouvrez une Pull Request

---

## Tests

Pour exécuter les tests unitaires et d’intégration :
```bash
make test
```

---

## Licence

Ce projet est sous licence MIT. Consultez le fichier `LICENSE` pour plus d'informations.

