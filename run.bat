@echo off
title Team Task Manager
echo ========================================
echo    Team Task Manager - Starting...
echo ========================================
echo.

echo [1/2] Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "title Backend - Port 5000 && npm run dev"

echo [2/2] Starting Frontend Server...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "title Frontend - Port 3000 && npm run dev"

echo.
echo ========================================
echo    Both servers are starting!
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:3000
echo ========================================
echo.
echo You can close this window.
timeout /t 5
