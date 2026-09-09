@echo off
REM ============================================
REM  SHOPIQ - Development Helper (Windows)
REM ============================================

echo [1/4] Starting Backend (Django :8000)...
start "SHOPIQ Backend" cmd /k "cd /d %~dp0backend && python manage.py seed_admin_roles && python manage.py runserver 8000"

echo [2/4] Starting Frontend (Next.js :3000)...
start "SHOPIQ Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo [3/4] Starting AI Engine (FastAPI :8001)...
start "SHOPIQ AI Engine" cmd /k "cd /d %~dp0ai_engine && uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

echo [4/4] Starting n8n (if using docker)...
echo  - n8n: docker compose up n8n -d   (http://localhost:5678)

echo.
echo All services starting in separate windows.
echo  Backend    : http://localhost:8000/api/
echo  Dev Admin  : http://localhost:8000/admin/   (Django admin, admin / admin123)
echo  Admin Panel: http://localhost:3000/admin/login  (super/billing/stock roles)
echo  Frontend   : http://localhost:3000
echo  AI Engine  : http://localhost:8001/api/docs
echo  n8n        : http://localhost:5678
pause
