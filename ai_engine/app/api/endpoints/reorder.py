from fastapi import APIRouter
from pydantic import BaseModel
from typing import List


router = APIRouter()


class ProductStock(BaseModel):
    product_name: str
    sku: str
    current_stock: int
    avg_daily_sales: float
    requires_perishable: bool = False
    lead_time_days: int = 1
    supplier_name: str
    supplier_phone: str
    min_stock_level: int = 5
    max_stock_level: int = 500


class ReorderSuggestion(BaseModel):
    product_name: str
    sku: str
    current_stock: int
    avg_daily_sales: float
    days_to_stockout: float
    risk_level: str
    suggested_quantity: int
    supplier_name: str
    supplier_phone: str
    reason: str


def _suggest_quantity(current: int, avg: float, lead: int, min_lvl: int, max_lvl: int) -> int:
    safety_stock = int(avg * lead * 1.5)
    target = current + (avg * 7) + safety_stock
    qty = int(target - current)
    return max(min(qty, max_lvl), min_lvl)


@router.post("", response_model=List[ReorderSuggestion])
async def suggest_reorders(products: List[ProductStock]):
    """Predict stock-outs and generate reorder suggestions."""
    suggestions = []
    for p in products:
        days_to_stockout = (p.current_stock / p.avg_daily_sales) if p.avg_daily_sales > 0 else 999.0

        if p.current_stock <= 0:
            risk = "critical"
        elif days_to_stockout <= 1:
            risk = "critical"
        elif days_to_stockout <= 3:
            risk = "high"
        elif p.current_stock <= p.min_stock_level:
            risk = "medium"
        else:
            risk = "low"

        if risk in ("critical", "high", "medium"):
            qty = _suggest_quantity(
                p.current_stock, p.avg_daily_sales,
                p.lead_time_days, p.min_stock_level, p.max_stock_level,
            )
            reason = (
                f"Out of stock now." if p.current_stock <= 0
                else f"Stock-out predicted in {days_to_stockout:.1f} days at current sale rate."
            )
            suggestions.append(
                ReorderSuggestion(
                    product_name=p.product_name,
                    sku=p.sku,
                    current_stock=p.current_stock,
                    avg_daily_sales=p.avg_daily_sales,
                    days_to_stockout=round(days_to_stockout, 1),
                    risk_level=risk,
                    suggested_quantity=qty,
                    supplier_name=p.supplier_name,
                    supplier_phone=p.supplier_phone,
                    reason=reason,
                )
            )
    return suggestions
