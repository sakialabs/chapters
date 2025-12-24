#!/bin/bash

echo "========================================"
echo "Chapters Development Environment"
echo "========================================"
echo ""
echo "Choose your setup:"
echo "[1] Full Docker (Backend + Database)"
echo "[2] Local Backend + Docker Database"
echo "[3] Stop all services"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "Starting all services in Docker..."
    docker-compose --profile full up
    ;;
  2)
    echo ""
    echo "[1/3] Starting PostgreSQL and Redis..."
    docker-compose up -d postgres redis

    echo ""
    echo "[2/3] Waiting for services to be healthy..."
    sleep 10

    echo ""
    echo "[3/3] Next steps:"
    echo ""
    echo "Start backend in a new terminal:"
    echo "  cd backend"
    echo "  poetry run uvicorn app.main:app --reload"
    echo ""
    echo "Start frontend in another terminal:"
    echo "  cd frontend"
    echo "  npm run dev"
    echo ""
    read -p "Press Enter to continue..."
    ;;
  3)
    echo ""
    echo "Stopping all services..."
    docker-compose down
    echo ""
    echo "Services stopped!"
    ;;
  *)
    echo "Invalid choice"
    ;;
esac

echo ""
echo "========================================"
echo "See docs/setup.md for detailed instructions"
echo "========================================"
