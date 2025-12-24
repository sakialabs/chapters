#!/bin/bash
set -e

echo "🔄 Waiting for database to be ready..."
until pg_isready -h postgres -U chapters; do
  echo "Waiting for postgres..."
  sleep 2
done

echo "✅ Database is ready!"

echo "🔄 Running database migrations..."
alembic upgrade head

echo "✅ Migrations complete!"

echo "🚀 Starting Chapters API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
