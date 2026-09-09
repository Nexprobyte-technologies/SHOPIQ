from fastapi import APIRouter
from app.api.endpoints import (
    health,
    sales,
    reorder,
    dead_stock,
    customers,
    health_score,
    ask,
)

router = APIRouter()

router.include_router(health.router, tags=["health"])
router.include_router(sales.router, prefix="/analyze", tags=["sales"])
router.include_router(reorder.router, prefix="/reorder", tags=["reorder"])
router.include_router(dead_stock.router, prefix="/dead-stock", tags=["dead-stock"])
router.include_router(customers.router, prefix="/customers", tags=["customers"])
router.include_router(health_score.router, prefix="/score", tags=["health-score"])
router.include_router(ask.router, prefix="/ask", tags=["ask"])
