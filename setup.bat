@echo off
echo ==========================================
echo ML Platform - Complete Setup
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Python version:
python --version
echo.
echo Node.js version:
node --version
echo.

REM Setup Backend
echo ==========================================
echo Setting up Backend...
echo ==========================================
cd backend
echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo Backend setup complete!
echo.

REM Setup Frontend
echo ==========================================
echo Setting up Frontend...
echo ==========================================
cd app
echo Installing Node dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo Frontend setup complete!
echo.

echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo To run the application:
echo.
echo 1. Start the backend (from the project directory):
echo    python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
echo.
echo 2. In another terminal, start the frontend:
echo    cd app
echo    npm run dev
echo.
echo 3. Open http://localhost:5173 in your browser
echo.
pause
