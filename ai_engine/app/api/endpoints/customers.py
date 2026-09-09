from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional


router = APIRouter()


class CustomerHistory(BaseModel):
    customer_name: str
    customer_phone: str
    product_name: str
    purchase_intervals_days: List[float]
    last_purchased_days_ago: int


class RefillPrediction(BaseModel):
    customer_name: str
    customer_phone: str
    product_name: str
    predicted_next_purchase_in_days: int
    confidence: float
    is_due: bool


@router.post("/refill", response_model=List[RefillPrediction])
async def predict_refills(customers: List[CustomerHistory], min_confidence: float = 0.7):
    """Predict when a customer is likely to repurchase a product, based on historic intervals."""
    predictions = []
    for c in customers:
        if not c.purchase_intervals_days:
            continue
        avg_interval = sum(c.purchase_intervals_days) / len(c.purchase_intervals_days)
        n = len(c.purchase_intervals_days)
        # Simple confidence: more data points => higher confidence, capped.
        confidence = min(0.95, 0.55 + (n * 0.08))

        predicted_in = max(1, int(round(avg_interval - c.last_purchased_days_ago)))
        is_due = predicted_in <= 2

        if confidence >= min_confidence:
            predictions.append(
                RefillPrediction(
                    customer_name=c.customer_name,
                    customer_phone=c.customer_phone,
                    product_name=c.product_name,
                    predicted_next_purchase_in_days=predicted_in,
                    confidence=round(confidence, 2),
                    is_due=is_due,
                )
            )
    return predictions
