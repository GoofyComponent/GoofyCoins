FROM php:8.3-fpm-alpine

# Définitions des ARG et ENV
ARG WORKDIR=/var/www/html
ENV DOCUMENT_ROOT=${WORKDIR}
ENV LARAVEL_PROCS_NUMBER=6
ARG GROUP_ID=1000
ARG USER_ID=1000
ENV USER_NAME=www-data
ARG GROUP_NAME=www-data

# Recréer l'utilisateur avec le bon UID/GID
RUN deluser ${USER_NAME} && \
    addgroup -g ${USER_ID} ${GROUP_NAME} && \
    adduser -u ${USER_ID} -G ${GROUP_NAME} -h /home/${USER_NAME} -s /bin/sh -D ${USER_NAME}

# Définir le fuseau horaire
RUN ln -fs /usr/share/zoneinfo/Europe/Paris /etc/localtime

# Installer les dépendances nécessaires
RUN apk add --no-cache \
    nginx \
    supervisor \
    redis \
    mysql-client \
    ca-certificates \
    curl \
    gnupg \
    shadow \
    bash \
    nodejs \
    npm \
    icu-dev \
    icu-libs

# Installer BCMath
RUN docker-php-ext-install bcmath

# Créer tous les répertoires nécessaires
RUN mkdir -p /etc/supervisor/conf.d && \
    mkdir -p /var/log/supervisor && \
    mkdir -p /var/log/nginx && \
    mkdir -p /var/log/php-fpm

RUN docker-php-ext-install pdo_mysql opcache pcntl && \
    docker-php-ext-configure intl && \
    docker-php-ext-install intl
    
# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Configurer le répertoire de travail
WORKDIR $WORKDIR

# Copier les fichiers de configuration nécessaires
ADD index.php $WORKDIR/index.php
ADD php.ini $PHP_INI_DIR/conf.d/
ADD php.ini $PHP_INI_DIR/conf.d/
ADD opcache.ini $PHP_INI_DIR/conf.d/
ADD supervisord.conf /etc/supervisor/supervisord.conf

# Copier le fichier d'entrée
COPY entrypoint.sh /usr/local/bin/

# Rendre le fichier exécutable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Modification des permissions
RUN chown -R ${USER_NAME}:${GROUP_NAME} /var/www && \
    chown -R ${USER_NAME}:${GROUP_NAME} /var/log/ && \
    chown -R ${USER_NAME}:${GROUP_NAME} /etc/supervisor/conf.d/ && \
    chown -R ${USER_NAME}:${GROUP_NAME} $PHP_INI_DIR/conf.d/ && \
    chown -R ${USER_NAME}:${GROUP_NAME} /tmp

# Définir le point d'entrée et la commande par défaut
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/local/bin/entrypoint.sh"]
