from django.db import models
from shops.models import Shop
import uuid


class DailySalesSummary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='daily_summaries')
    date = models.DateField()
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_transactions = models.IntegerField(default=0)
    total_items_sold = models.IntegerField(default=0)
    total_customers = models.IntegerField(default=0)
    new_customers = models.IntegerField(default=0)
    avg_transaction_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    top_selling_product = models.CharField(max_length=200, blank=True)
    peak_hour = models.IntegerField(default=0)
    cash_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    upi_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit_given = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daily_sales_summaries'
        unique_together = ['shop', 'date']


class WeeklyTrend(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='weekly_trends')
    week_start = models.DateField()
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sales_growth_pct = models.FloatField(default=0)
    avg_daily_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    top_products = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'weekly_trends'
        unique_together = ['shop', 'week_start']


class MonthlyReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='monthly_reports')
    month = models.IntegerField()
    year = models.IntegerField()
    total_sales = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_purchases = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    gross_profit = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    profit_margin = models.FloatField(default=0)
    total_customers = models.IntegerField(default=0)
    new_customers = models.IntegerField(default=0)
    repeat_customers = models.IntegerField(default=0)
    stock_turnover = models.FloatField(default=0)
    dead_stock_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'monthly_reports'
        unique_together = ['shop', 'month', 'year']
