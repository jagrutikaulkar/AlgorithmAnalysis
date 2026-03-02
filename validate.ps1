# ML Platform - Validation Script
# This script checks if all dependencies are properly installed

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "ML Platform - Validation & Quick Start" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($?) {
    Write-Host "✓ Python installed: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit
}

# Check pip
Write-Host "Checking pip..." -ForegroundColor Yellow
$pipVersion = pip --version 2>&1
if ($?) {
    Write-Host "✓ pip installed: $pipVersion" -ForegroundColor Green
} else {
    Write-Host "✗ pip not found" -ForegroundColor Red
    exit
}

# Check Node.js
Write-Host "`nChecking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($?) {
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js 14+" -ForegroundColor Red
    exit
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>&1
if ($?) {
    Write-Host "✓ npm installed: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Checking Backend Dependencies..." -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python packages
$packages = @("fastapi", "uvicorn", "pandas", "numpy", "scikit-learn")

foreach ($package in $packages) {
    try {
        $output = python -c "import $($package.Replace('-', '_')); print('OK')" 2>&1
        if ($output -eq "OK") {
            Write-Host "✓ $package installed" -ForegroundColor Green
        } else {
            Write-Host "✗ $package issue: $output" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ $package not installed" -ForegroundColor Red
    }
}

# Check optional packages
Write-Host "`nOptional packages:" -ForegroundColor Yellow
$optionalPackages = @("xgboost", "matplotlib", "seaborn")
foreach ($package in $optionalPackages) {
    try {
        $output = python -c "import $($package.Replace('-', '_')); print('OK')" 2>&1
        if ($output -eq "OK") {
            Write-Host "✓ $package installed" -ForegroundColor Green
        } else {
            Write-Host "○ $package not installed (optional)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "○ $package not installed (optional)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Checking Frontend Setup..." -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists in app folder
if (Test-Path "app/node_modules") {
    Write-Host "✓ Frontend dependencies installed (node_modules found)" -ForegroundColor Green
} else {
    Write-Host "○ Frontend dependencies not installed. Run: npm install from 'app' folder" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Quick Start Guide" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Use the batch script (Recommended)" -ForegroundColor Green
Write-Host "  run.bat" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Manual start" -ForegroundColor Green
Write-Host "  Terminal 1 - Start Backend:" -ForegroundColor White
Write-Host "    cd backend" -ForegroundColor White
Write-Host "    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor White
Write-Host ""
Write-Host "  Terminal 2 - Start Frontend:" -ForegroundColor White
Write-Host "    cd app" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  Then open: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Sample Data: sample_data.csv (Iris dataset)" -ForegroundColor Green
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Validation Complete!" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
