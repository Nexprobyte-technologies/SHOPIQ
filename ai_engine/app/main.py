"""
AI Mart AI Engine
-----------------
Standalone FastAPI service that generates AI insights for shop owners.

Endpoints:
- /health         : health check
- /analyze/sales  : sales drop / growth analysis
- /analyze/reorder: stock-out prediction & reorder suggestions
- /analyze/dead   : dead stock detection
- /analyze/customers: customer refill prediction
- /score/health   : shop health score
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(
    title="AI Mart AI Engine",
    description="AI Business Operating System for Shops",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
