@echo off
echo ==========================================
echo ML Platform - Starting Application
echo ==========================================
echo.
echo This script will start both the backend and frontend servers.
echo.

REM Start Backend in background
echo Starting Backend server on http://localhost:8000...
start cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3

REM Start Frontend
echo Starting Frontend development server on http://localhost:5173...
cd app
start cmd /k "npm run dev"

echo.
echo ==========================================
echo Servers are starting...
echo ==========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo The frontend will open in your browser shortly.
echo If not, please visit http://localhost:5173 manually.
echo.
pause
