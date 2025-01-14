.PHONY: up down exec pint

up:
	docker-compose up -d

down:
	docker-compose down

exec:
	docker-compose exec laravel bash

pint:
	docker-compose exec laravel ./vendor/bin/pint