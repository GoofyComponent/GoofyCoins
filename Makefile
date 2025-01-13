.PHONY: up down exec

up:
	docker-compose up -d

down:
	docker-compose down

exec:
	docker-compose exec laravel bash