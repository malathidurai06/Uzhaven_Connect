# Uzhavan Connect — Unified PowerShell Launcher
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "   🌾 UZHAVAN CONNECT — AI-POWERED SMART AGRI-TECH MARKETPLACE" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""

# [1/3] Start AI Service
Write-Host "[1/3] Starting AI Microservice (FastAPI on port 8000)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList '/k "cd ai-service && if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) && python -m uvicorn main:app --port 8000 --reload"'

# [2/3] Build Frontend
Write-Host "[2/3] Building Frontend Production Bundle..." -ForegroundColor Cyan
Push-Location frontend
npm run build
Pop-Location

# [3/3] Start Backend Server
Write-Host "[3/3] Starting Backend Server (Express on port 5000)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList '/k "cd backend && node server.js"'

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  ✅ Application is live at: http://localhost:5000" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green

Start-Sleep -Seconds 2
Start-Process "http://localhost:5000"
