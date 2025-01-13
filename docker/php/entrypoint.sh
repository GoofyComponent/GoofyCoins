#!/bin/bash

echo ""
echo "***********************************************************"
echo "   Starting LARAVEL PHP-FPM Container                      "
echo "***********************************************************"

set -e
info() {
    { set +x; } 2> /dev/null
    echo '[INFO] ' "$@"
}
warning() {
    { set +x; } 2> /dev/null
    echo '[WARNING] ' "$@"
}
fatal() {
    { set +x; } 2> /dev/null
    echo '[ERROR] ' "$@" >&2
    exit 1
}

## Check if .env exists, else copy .env.example
if [ ! -f /var/www/html/.env ]; then
    if [ -f /var/www/html/.env.example ]; then
        cp /var/www/html/.env.example /var/www/html/.env
        info ".env file was missing. Copied .env.example to .env"
    else
        fatal "Both .env and .env.example are missing. Cannot proceed."
    fi
else
    info ".env file already exists."
fi

## Composer and npm install
if [ -f /var/www/html/composer.json ]; then
    info "Composer file found, installing dependencies..."
    cd /var/www/html
    composer install --no-interaction --no-progress --no-suggest
    info "Composer dependencies installed"
else
    info "Composer file not found"
fi

if [ -f /var/www/html/package.json ]; then
    info "Npm file found, installing dependencies..."
    cd /var/www/html
    npm install
    info "Npm dependencies installed"
else
    info "Npm file not found"
fi

## Check if the artisan file exists
if [ -f /var/www/html/artisan ]; then
    info "Artisan file found, creating laravel supervisor config..."
    ##Create Laravel Scheduler process
    TASK=/etc/supervisor/conf.d/laravel-worker.conf
    touch $TASK
    cat > "$TASK" <<EOF
    [program:Laravel-scheduler]
    process_name=%(program_name)s_%(process_num)02d
    command=/bin/sh -c "while [ true ]; do (php /var/www/html/artisan schedule:run --verbose --no-interaction &); sleep 60; done"
    autostart=true
    autorestart=true
    numprocs=1
    user=$USER_NAME
    stdout_logfile=/var/www/html/storage/logs/laravel_scheduler.log
    redirect_stderr=true

    [program:Laravel-worker]
    process_name=%(program_name)s_%(process_num)02d
    command=php /var/www/html/artisan queue:work redis --sleep=3 --tries=3
    autostart=true
    autorestart=true
    stopasgroup=true
    killasgroup=true
    numprocs=$LARAVEL_PROCS_NUMBER
    user=$USER_NAME
    redirect_stderr=true
    stdout_logfile=/var/www/html/storage/logs/laravel_worker.log
    stopwaitsecs=3600

    [program:Laravel-horizon]
    process_name=%(program_name)s_%(process_num)02d
    command=php /var/www/html/artisan horizon
    autostart=true
    autorestart=true
    numprocs=1
    user=$USER_NAME
    redirect_stderr=true
    stdout_logfile=/var/www/html/storage/logs/laravel_horizon.log

    [program:Laravel-reverb]
    process_name=%(program_name)s_%(process_num)02d
    command=php /var/www/html/artisan reverb:start --verbose --no-interaction --host=0.0.0.0 --port=8080
    autostart=true
    autorestart=true
    numprocs=1
    user=$USER_NAME
    redirect_stderr=true
    stdout_logfile=/var/www/html/storage/logs/laravel_reverb.log

EOF
    info "Laravel supervisor config created"
else
    info "artisan file not found"
fi

## Check if php.ini file exists
if [ -f /var/www/html/conf/php/php.ini ]; then
    cp /var/www/html/conf/php/php.ini $PHP_INI_DIR/conf.d/
    info "Custom php.ini file found and copied in  $PHP_INI_DIR/conf.d/"
else
    info "Custom php.ini file not found"
    info "If you want to add a custom php.ini file, you add it in /var/www/html/conf/php/php.ini"
fi


# Create the storage folder if it does not exist
if [ ! -d /var/www/html/storage ]; then
    info "Storage folder not found, creating storage folder..."
    mkdir -p /var/www/html/storage
    info "Storage folder created"
else
    info "Storage folder already exists"
fi

# Create the logs folder if it does not exist
if [ ! -d /var/www/html/storage/logs ]; then
    info "Logs folder not found, creating logs folder..."
    mkdir -p /var/www/html/storage/logs
    info "Logs folder created"
else
    info "Logs folder already exists"
fi

# Create the laravel.log file if it does not exist
if [ ! -f /var/www/html/storage/logs/laravel.log ]; then
    info "laravel.log file not found, creating laravel.log file..."
    touch /var/www/html/storage/logs/laravel.log
    info "laravel.log file created"
else
    info "laravel.log file already exists"
fi

# every rights to the storage folder
chmod -R 777 /var/www/html/storage/logs/laravel.log


info "Waiting for database connection to be ready..."

MAX_RETRIES=10
RETRY_DELAY=10
DB_READY=0

for i in $(seq 1 $MAX_RETRIES); do
    if php /var/www/html/artisan db:show > /dev/null 2>&1; then
        info "Database connection successful. Running migrations..."
        DB_READY=1
        break
    else
        warning "Database connection failed. Retrying in $RETRY_DELAY seconds... (Attempt $i/$MAX_RETRIES)"
        sleep $RETRY_DELAY
    fi
done

if [ $DB_READY -eq 1 ]; then
    php /var/www/html/artisan migrate --force
    info "Database migrations completed successfully."
else
    fatal "Database connection failed after $MAX_RETRIES attempts. Exiting..."
fi

supervisord -c /etc/supervisor/supervisord.conf