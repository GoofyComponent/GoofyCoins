.PHONY: up down exec pint install-back install-front install fresh clear test

up:
	docker-compose up -d

down:
	docker-compose down

exec:
	docker-compose exec laravel bash

pint:
	docker-compose exec laravel ./vendor/bin/pint

fresh:
	docker-compose exec laravel php artisan migrate:fresh --seed

install-back:
	docker-compose exec laravel composer install

install-front:
	docker-compose exec react npm install

install: install-back install-front

clear: 
	docker-compose exec laravel php artisan config:clear

test:
	docker-compose exec laravel ./vendor/bin/phpunit