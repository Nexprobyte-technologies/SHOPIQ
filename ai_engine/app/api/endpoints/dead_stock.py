from fastapi import APIRouter
from pydantic import BaseModel
from typing import List


router = APIRouter()


class ProductReport(BaseModel):
    product_name: str
    sku: str
    current_stock: int
    cost_price: float
    selling_price: float
    last_sold_days_ago: int
    total_inventory_value: float


class DeadStockResult(BaseModel):
    product_name: str
    sku: str
    days_since_last_sale: int
    locked_value: float
    recommendation: str
    action_type: str


@router.post("", response_model=List[DeadStockResult])
async def detect_dead_stock(products: List[ProductReport], threshold_days: int = 60):
    """Identify products that haven't moved within a threshold and suggest recovery actions."""
    results = []
    for p in products:
        if p.last_sold_days_ago >= threshold_days:
            locked_value = p.current_stock * p.cost_price
            # Simple rule-based recommendation
            if p.current_stock >= 20:
                action_type = "bogo"
                recommendation = f"Run Buy 1 Get 1 on {p.product_name} to clear {p.current_stock} units."
            elif p.selling_price > p.cost_price * 1.3:
                action_type = "discount"
                recommendation = f"Offer Rs.20 discount on {p.product_name} (margin allows it)."
            else:
                action_type = "bundle"
                recommendation = f"Bundle {p.product_name} with a bestseller to move stock."
            results.append(
                DeadStockResult(
                    product_name=p.product_name,
                    sku=p.sku,
                    days_since_last_sale=p.last_sold_days_ago,
                    locked_value=round(locked_value, 2),
                    recommendation=recommendation,
                    action_type=action_type,
                )
            )
    return results
