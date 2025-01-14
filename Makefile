.PHONY: up down exec pint install-back install-front install

up:
	docker-compose up -d

down:
	docker-compose down

exec:
	docker-compose exec laravel bash

pint:
	docker-compose exec laravel ./vendor/bin/pint

install-back:
	docker-compose exec laravel composer install

install-front:
	docker-compose exec react npm install

install: install-back install-front