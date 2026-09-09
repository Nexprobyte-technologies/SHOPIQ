from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "SHOPIQ AI Engine"
    debug: bool = True
    api_base_url: str = "http://localhost:8000"
    health_score_weights: dict = {
        "sales_growth": 0.25,
        "profit_margin": 0.20,
        "stock_turnover": 0.20,
        "customer_retention": 0.20,
        "dead_stock": 0.10,
        "outstanding_credit": 0.05,
    }
    dead_stock_days: int = 60
    reorder_days_ahead: int = 3
    customer_refill_confidence: float = 0.75

    class Config:
        env_file = ".env"


settings = Settings()
