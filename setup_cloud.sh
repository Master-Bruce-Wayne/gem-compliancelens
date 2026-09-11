#!/bin/bash
export DATABASE_URL="postgresql+asyncpg://postgres:Shubham15986@db.dvsoqzgilthzpncplmir.supabase.co:5432/postgres"

echo "Running Database Migrations on Supabase..."
docker-compose exec -e DATABASE_URL="$DATABASE_URL" backend alembic upgrade head

echo "Seeding Database on Supabase..."
docker-compose exec -e DATABASE_URL="$DATABASE_URL" backend python -m app.scripts.seed --file /app/seed_data.json

echo "Done!"
