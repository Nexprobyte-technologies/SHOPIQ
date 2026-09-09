from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict


router = APIRouter()


WEIGHTS = {
    "sales_growth": 0.25,
    "profit_margin": 0.20,
    "stock_turnover": 0.20,
    "customer_retention": 0.20,
    "dead_stock": 0.10,
    "outstanding_credit": 0.05,
}


class HealthFactors(BaseModel):
    sales_growth: float
    profit_margin: float
    stock_turnover: float
    customer_retention: float
    dead_stock: float       # 0 = good, 100 = bad; inverted internally
    outstanding_credit: float  # 0 = good, 100 = bad; inverted internally


class HealthScoreResponse(BaseModel):
    score: float
    grade: str
    breakdown: Dict[str, float]
    recommendations: list


def _invert(value: float) -> float:
    return max(0.0, min(100.0, 100 - value))


@router.post("", response_model=HealthScoreResponse)
async def compute_health_score(factors: HealthFactors):
    """Compute a weighted 0-100 health score."""
    components = {
        "sales_growth": factors.sales_growth,
        "profit_margin": factors.profit_margin,
        "stock_turnover": factors.stock_turnover,
        "customer_retention": factors.customer_retention,
        "dead_stock": _invert(factors.dead_stock),
        "outstanding_credit": _invert(factors.outstanding_credit),
    }
    score = sum(components[k] * WEIGHTS[k] for k in WEIGHTS)
    score = round(max(0.0, min(100.0, score)), 1)

    if score >= 80:
        grade = "Excellent"
    elif score >= 60:
        grade = "Good"
    elif score >= 40:
        grade = "Fair"
    else:
        grade = "Poor"

    recommendations = []
    if factors.profit_margin < 30:
        recommendations.append("Improve profit margin by renegotiating supplier costs.")
    if factors.stock_turnover < 60:
        recommendations.append("Increase stock turnover by clearing slow movers.")
    if factors.dead_stock > 40:
        recommendations.append("Run promotions to recover dead stock capital.")
    if factors.outstanding_credit > 30:
        recommendations.append("Recover outstanding credit from overdue customers.")

    return HealthScoreResponse(
        score=score,
        grade=grade,
        breakdown={k: round(v, 1) for k, v in components.items()},
        recommendations=recommendations,
    )
