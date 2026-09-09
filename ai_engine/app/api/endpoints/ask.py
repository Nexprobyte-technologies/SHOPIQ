from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class AskQuestion(BaseModel):
    question: str
    shop_id: str = ""


class AskResponse(BaseModel):
    question: str
    intent: str
    answer: str
    suggested_actions: list


@router.post("", response_model=AskResponse)
async def ask_business_question(req: AskQuestion):
    """Interpret a natural-language business question and return an answer template.

    In production this would call an LLM that queries the Django API + AI engine.
    Here we route on keyword intent.
    """
    q = req.question.lower()

    if any(k in q for k in ["sales", "down", "decreased", "why"]):
        intent = "sales_analysis"
        answer = (
            "Sales analysis suggests a decline. Common causes: stock-outs of top sellers, "
            "reduced footfall, or fewer promotions. Action: re-stock top products, run a "
            "combo offer, and extend peak-hour staffing."
        )
        actions = ["Re-stock top products", "Run combo offer", "Extend evening hours"]
    elif any(k in q for k in ["reorder", "stock", "order", "restock"]):
        intent = "reorder"
        answer = "I found products at risk of stock-out. Approve suggested quantities and I will send WhatsApp orders to suppliers."
        actions = ["Review reorder list", "Send WhatsApp orders"]
    elif any(k in q for k in ["owe", "credit", "money", "pay"]):
        intent = "credit_collection"
        answer = "There are outstanding credits from 2 customers overdue by 30+ days. I can send WhatsApp reminders."
        actions = ["View outstanding credit", "Send reminders"]
    elif any(k in q for k in ["offer", "promotion", "discount", "promo"]):
        intent = "promotion"
        answer = "Based on slow movers and forecast, a Rs.50 combo offer this weekend could recover dead stock and lift sales ~8%."
        actions = ["Create combo offer", "Send WhatsApp promotion"]
    else:
        intent = "general"
        answer = "I can analyze sales, forecast stock-outs, manage reorders, and send WhatsApp automations. What would you like to know?"
        actions = []

    return AskResponse(question=req.question, intent=intent, answer=answer, suggested_actions=actions)
