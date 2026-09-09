from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional


router = APIRouter()


class SalesPoint(BaseModel):
    date: str
    sales: float


class SalesAnalysis(BaseModel):
    period: str
    total_sales: float
    growth_pct: float
    trend: str
    causes: List[str]
    recommendations: List[str]


class DailyStats(BaseModel):
    date: str
    total_sales: float
    transactions: int


@router.post("/sales", response_model=SalesAnalysis)
async def analyze_sales(data: List[SalesPoint]):
    """Analyze a series of daily sales points.

    Detects trend direction, computes growth %,
    and produces causal hypotheses and recommendations.
    """
    if not data:
        return SalesAnalysis(
            period="unknown", total_sales=0, growth_pct=0,
            trend="flat", causes=[], recommendations=[]
        )

    # Sort by date
    data = sorted(data, key=lambda d: d.date)
    total = sum(p.sales for p in data)

    if len(data) < 2:
        trend = "flat"
        growth = 0.0
    else:
        mid = len(data) // 2
        first_half = sum(p.sales for p in data[:mid]) / max(mid, 1)
        second_half = sum(p.sales for p in data[mid:]) / max(len(data) - mid, 1)
        growth = ((second_half - first_half) / first_half * 100) if first_half else 0.0
        if growth <= -5:
            trend = "down"
        elif growth >= 5:
            trend = "up"
        else:
            trend = "stable"

    causes = []
    recommendations = []
    if trend == "down":
        causes.append("Sales declined compared to earlier period.")
        causes.append("Check for stock-outs, footfall drop, or reduced promotions.")
        recommendations.append("Re-stock top-selling items.")
        recommendations.append("Run a targeted combo/complementary offer.")
        recommendations.append("Extend peak-hours staffing.")
    elif trend == "up":
        recommendations.append("Maintain current momentum; consider upselling.")
    else:
        recommendations.append("Monitor closely; no immediate action needed.")

    return SalesAnalysis(
        period=f"{data[0].date} to {data[-1].date}",
        total_sales=total,
        growth_pct=round(growth, 1),
        trend=trend,
        causes=causes,
        recommendations=recommendations,
    )
