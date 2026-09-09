from django.db import models
from shops.models import Shop
import uuid


class AIInsight(models.Model):
    INSIGHT_TYPES = [
        ('sales_drop', 'Sales Drop Alert'),
        ('stock_alert', 'Stock Alert'),
        ('dead_stock', 'Dead Stock Alert'),
        ('reorder', 'Reorder Suggestion'),
        ('customer_return', 'Customer Return Prediction'),
        ('health_score', 'Health Score Update'),
        ('promotion', 'Promotion Suggestion'),
        ('voice_billing', 'Voice Billing Log'),
        ('general', 'General Insight'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='ai_insights')
    insight_type = models.CharField(max_length=30, choices=INSIGHT_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_read = models.BooleanField(default=False)
    is_actioned = models.BooleanField(default=False)
    action_taken = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_insights'
        ordering = ['-created_at']


class AutoReorder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('sent', 'Order Sent'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='auto_reorders')
    product_name = models.CharField(max_length=200)
    current_stock = models.IntegerField()
    avg_daily_sales = models.FloatField()
    expected_stockout_days = models.FloatField()
    suggested_quantity = models.IntegerField()
    supplier_name = models.CharField(max_length=200)
    supplier_phone = models.CharField(max_length=15)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_sent_via = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'auto_reorders'


class CustomerPrediction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='customer_predictions')
    customer_phone = models.CharField(max_length=15)
    customer_name = models.CharField(max_length=200)
    product_name = models.CharField(max_length=200)
    predicted_next_purchase_date = models.DateField()
    confidence_score = models.FloatField()
    purchase_frequency_days = models.FloatField()
    last_purchased_date = models.DateField()
    whatsapp_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'customer_predictions'
