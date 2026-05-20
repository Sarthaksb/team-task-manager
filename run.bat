@echo off
title Team Task Manager
echo ========================================
echo    Team Task Manager - Starting...
echo ========================================
echo.

echo [Step 1] Cleaning up any zombie servers...
:: Kill process on port 5000 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /C:":5000" ^| findstr LISTENING') do (
    echo Found zombie backend on port 5000 with PID %%a. Killing it...
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill process on port 3000 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /C:":3000" ^| findstr LISTENING') do (
    echo Found zombie frontend on port 3000 with PID %%a. Killing it...
    taskkill /f /pid %%a >nul 2>&1
)
echo Zombie cleanup complete!
echo.

echo [Step 2] Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "title Backend - Port 5000 && npm run dev"

echo [Step 3] Starting Frontend Server...
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
