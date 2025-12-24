@echo off
echo.
echo ====================================
echo   Seeding Database (Docker)
echo ====================================
echo.

docker exec chapters-backend sh -c "export PYTHONPATH=/app && cd /app && python scripts/seed_database.py"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   Database seeded successfully!
    echo ====================================
    echo.
    echo Demo accounts (password: password123):
    echo   - maya_writes
    echo   - alex_creates
    echo   - sam_reflects
    echo   - jordan_dreams
    echo   - riley_wanders
    echo.
) else (
    echo.
    echo ====================================
    echo   Error seeding database
    echo ====================================
    echo.
    echo Make sure the backend container is running:
    echo   docker-compose --profile full up
    echo.
)

pause
