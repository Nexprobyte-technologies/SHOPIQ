from django.db import models
from accounts.models import User
import uuid


class Shop(models.Model):
    SHOP_TYPE_CHOICES = [
        ('grocery', 'Grocery'),
        ('pharmacy', 'Pharmacy'),
        ('restaurant', 'Restaurant'),
        ('clothing', 'Clothing'),
        ('electronics', 'Electronics'),
        ('hardware', 'Hardware'),
        ('other', 'Other'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shops')
    name = models.CharField(max_length=200)
    shop_type = models.CharField(max_length=20, choices=SHOP_TYPE_CHOICES, default='grocery')
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    gst_number = models.CharField(max_length=20, blank=True)
    logo = models.ImageField(upload_to='shop_logos/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    subscription_plan = models.CharField(max_length=20, default='free')
    health_score = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shops'

    def __str__(self):
        return self.name


class ShopStaff(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='staff')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shop_memberships')
    role = models.CharField(max_length=20, default='staff')
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'shop_staff'
