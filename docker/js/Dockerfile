# Utilise Node.js 18 comme image de base
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie le fichier package.json pour installer les dépendances
RUN chmod -R 777 /app

# Copie l'entrypoint
COPY entrypoint.sh /entrypoint.sh

# Rend l'entrypoint exécutable
RUN chmod +x /entrypoint.sh

# Expose le port utilisé par Vite
EXPOSE 5173

# Définit l'entrypoint
ENTRYPOINT ["/entrypoint.sh"]
