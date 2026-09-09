# 🏪 AI Mart — AI Business Operating System for Shops

> **Your shop software doesn't just record your business. It tells you what to do next.**

AI Mart is not another billing software — it's an **AI Business Operating System for small shops**. It goes beyond Billing + Stock + Payments to give shop owners an AI assistant that analyzes data and tells them what to do next.

## 🏗️ Architecture

```
Next.js (Dashboard UI)
        ↓  API
Django REST API
        ↓
PostgreSQL
        ↓
 ┌──────────────┴─────────────┐
 ↓                            ↓
Python AI Engine (FastAPI)    n8n (Automations)
  - Sales analysis            - WhatsApp orders
  - Stock-out prediction      - Refill reminders
  - Dead stock detection      - Daily summaries
  - Customer refill prediction
  - Health score
```

## ✨ The 7 AI Features (USP)

1. **AI Shop Manager** — The software *tells* the owner what's happening instead of them digging through reports
2. **Auto Re-Order System** — Stock drops → predicts stock-out → one-click WhatsApp order to supplier
3. **Customer Return Predictor** — Predict refill dates → auto WhatsApp marketing
4. **Dead Stock Recovery** — Identify slow movers → suggest discount/combo → convert stock to cash
5. **Shop Health Score** — One score (0–100) summarizing entire business health
6. **Voice Billing** — Tamil + English voice → auto bill creation
7. **"Why Sales Down?" AI** — Natural-language root-cause analysis + recommended actions

## 📁 Project Structure

```
AI_Mart/
├── frontend/          # Next.js 16 + Tailwind CSS v4 dashboard
│   └── src/
│       ├── app/       # Pages: dashboard, billing, products, stock,
│       │              #         customers, ai-insights, voice-billing,
│       │              #         sales-analytics, health-score, automations,
│       │              #         why-sales-down, settings, login
│       ├── components/ # Sidebar, Topbar, UI primitives (Card, Button, etc.)
│       ├── lib/        # api client, utils
│       └── types/      # TypeScript interfaces
├── backend/           # Django REST API
│   ├── accounts/      # Users & JWT auth (roles: super/dev/billing/stock admin)
│   ├── shops/         # Shop, ShopStaff
│   ├── products/      # Category, Supplier, Product, StockMovement
│   ├── billing/       # Customer, Invoice, InvoiceItem, Payment
│   ├── analytics/     # Daily/Weekly/Monthly sales summaries
│   └── ai_insights/   # AIInsight, AutoReorder, CustomerPrediction
├── ai_engine/         # Python FastAPI AI Engine
│   └── app/
│       ├── api/endpoints/  # sales, reorder, dead_stock, customers,
│       │                   # health_score, ask (natural language)
│       └── config.py
├── automations/       # n8n workflow JSON exports (WhatsApp etc.)
└── docker-compose.yml # Full-stack: postgres + backend + frontend + ai-engine + n8n
```

## 🚀 Quick Start

### 1. Database (PostgreSQL)
```bash
docker compose up postgres -d
# or create DB manually:
# createdb ai_mart_db
```

### 2. Backend (Django)
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # configure DB credentials
python manage.py migrate
python manage.py seed_admin_roles   # creates the 4 role admin accounts
python manage.py runserver
# API at http://localhost:8000/api/
# Django admin (Jazzmin themed) at http://localhost:8000/admin/
```

### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Dashboard at http://localhost:3000
```

### 4. AI Engine (FastAPI)
```bash
cd ai_engine
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
# AI API at http://localhost:8001/api/docs
```

### 5. n8n Automations
```bash
docker compose up n8n -d
# http://localhost:5678  (admin / admin123)
# Import workflows from /automations
```

### Full stack
```bash
docker compose up --build
```

## 🔐 User Roles
| Status | Role |
|--------|------|
| 1 | Dev Admin |
| 2 | Super Admin |
| 3 | Billing Admin |
| 4 | Stock Received Admin |

## 🎨 UI
Dashboard UI is styled after the **Dreams AI Agent** Tailwind admin template — modern, clean, with gradient accents, dark-mode-ready color tokens, and mobile responsive layout.

## ⚙️ Tech Stack
- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS v4, Lucide icons
- **Backend:** Django 5, Django REST Framework, SimpleJWT, Channels
- **Database:** PostgreSQL
- **AI:** Python FastAPI engine (custom analytics + rules + future LLM hooks)
- **Automation:** n8n (WhatsApp, email, push notifications)
# AI_Mart
