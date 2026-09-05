@echo off
title Uzhavan Connect - Unified Launcher
echo ======================================================================
echo    🌾 UZHAVAN CONNECT — AI-POWERED SMART AGRI-TECH MARKETPLACE
echo ======================================================================
echo.

echo [1/3] Starting AI Microservice (FastAPI on port 8000)...
start "Uzhavan Connect - AI Service" cmd /k "cd ai-service && if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) && python -m uvicorn main:app --port 8000 --reload"

echo [2/3] Building Frontend Production Bundle...
cd frontend
call npm run build
cd ..

echo [3/3] Starting Backend Server (Express + Database on port 5000)...
start "Uzhavan Connect - Main Server" cmd /k "cd backend && node server.js"

echo.
echo ======================================================================
echo  ✅ Application is live at: http://localhost:5000
echo ======================================================================
echo Opening browser...
timeout /t 3 >nul
start http://localhost:5000
