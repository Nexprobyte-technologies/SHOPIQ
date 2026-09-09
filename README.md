# 🏪 SHOPIQ — AI Business Operating System for Shops

> **Your shop software doesn't just record your business. It tells you what to do next.**

SHOPIQ is not another billing software — it's an **AI Business Operating System for small shops**. It goes beyond Billing + Stock + Payments to give shop owners an AI assistant that analyzes data and tells them what to do next.

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
│   ├── ai_insights/   # AIInsight, AutoReorder, CustomerPrediction
│   └── operations/    # Employee, Attendance, StackEntry, PackDelivery
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
# createdb shopiq_db
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

## 🔐 Role-Based Admin Panel

Each role logs in through **`http://localhost:3000/admin/login`** and is routed to its own panel:

| Status | Role | Where it runs | Username | Password | Access |
|--------|------|---------------|----------|----------|--------|
| 1 | Dev Admin | **Django admin** (`/admin/`, Jazzmin) | `admin` | `admin123` | Full system access, manage users with **auto 12-digit password** generator, check all panels |
| 2 | Super Admin | Frontend panel | `superadmin` | `superadmin@123` | Stores, billing & payments, stack minose/increase, employee attendance, send stack report |
| 3 | Billing Admin | Frontend panel | `billadmin` | `billadmin@123` | Enter daily bills |
| 4 | Stock Received Admin | Frontend panel | `stackadmin` | `stackadmin@123` | Confirm stack received, pack & delivery tracking dropdowns |

- **Status 1 (Dev Admin)** uses the Django admin only. Its dashboard is the Jazzmin-styled admin at
  `http://localhost:8000/admin/` — where it can add users and auto-generate 12-digit numeric passwords
  (the "Generate 12-digit password" action on the Users list, or leave password blank on add).
- **Status 2 / 3 / 4** use the frontend role panels (Pulse-UI style): sidebar navigation on the left, content on the right.
- Admins are seeded with `python manage.py seed_admin_roles`.

### User Roles
| Status | Role |
|--------|------|
| 1 | Dev Admin |
| 2 | Super Admin |
| 3 | Billing Admin |
| 4 | Stock Received Admin |

### Operations API (in `backend/operations/`)
- `/api/employees/`, `/api/attendances/` — employee & attendance tracking
- `/api/stacks/` (+ `POST /api/stacks/:id/confirm/`) — stack received / increase / decrease, confirm updates live product stock
- `/api/deliveries/` — pack & delivery tracking with dropdown statuses

## 🎨 UI
Dashboard UI is styled after the **Dreams AI Agent** Tailwind admin template — modern, clean, with gradient accents, dark-mode-ready color tokens, and mobile responsive layout. The role admin panel follows the **Pulse UI** look with a purple gradient sidebar.

## ⚙️ Tech Stack
- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS v4, Lucide icons
- **Backend:** Django 5, Django REST Framework, SimpleJWT, Channels, Jazzmin
- **Database:** PostgreSQL
- **AI:** Python FastAPI engine (custom analytics + rules + future LLM hooks)
- **Automation:** n8n (WhatsApp, email, push notifications)
# AI_Mart
