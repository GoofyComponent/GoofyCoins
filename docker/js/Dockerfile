# Utilise Node.js 18 Alpine comme image de base
FROM node:20-alpine

# Définit le répertoire de travail
WORKDIR /app

# Installe les dépendances système nécessaires (si besoin, par exemple pour des builds npm)
RUN apk add --no-cache bash

# Copie l'entrypoint
COPY entrypoint.sh /entrypoint.sh

# Rend l'entrypoint exécutable
RUN chmod +x /entrypoint.sh

# Assure que le dossier de travail est accessible
RUN chmod -R 777 /app

# Expose le port utilisé par Vite
EXPOSE 3000

# Définit l'entrypoint
ENTRYPOINT ["/entrypoint.sh"]
