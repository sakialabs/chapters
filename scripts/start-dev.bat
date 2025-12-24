@echo off
echo ========================================
echo Chapters Development Environment
echo ========================================
echo.
echo Choose your setup:
echo [1] Full Docker (Backend + Database)
echo [2] Local Backend + Docker Database
echo [3] Stop all services
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" goto docker_full
if "%choice%"=="2" goto local_backend
if "%choice%"=="3" goto stop_services
goto end

:docker_full
echo.
echo Starting all services in Docker...
docker-compose --profile full up
goto end

:local_backend
echo.
echo [1/3] Starting PostgreSQL and Redis...
docker-compose up -d postgres redis

echo.
echo [2/3] Waiting for services to be healthy...
timeout /t 10 /nobreak > nul

echo.
echo [3/3] Next steps:
echo.
echo Start backend in a new terminal:
echo   cd backend
echo   poetry run uvicorn app.main:app --reload
echo.
echo Start frontend in another terminal:
echo   cd frontend
echo   npm run dev
echo.
pause
goto end

:stop_services
echo.
echo Stopping all services...
docker-compose down
echo.
echo Services stopped!
goto end

:end
echo.
echo ========================================
echo See docs/setup.md for detailed instructions
echo ========================================
pause
