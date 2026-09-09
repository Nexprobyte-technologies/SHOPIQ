from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
import secrets
import string


class User(AbstractUser):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('dev_admin', 'Dev Admin'),
        ('billing_admin', 'Billing Admin'),
        ('stock_admin', 'Stock Admin'),
        ('shop_owner', 'Shop Owner'),
        ('shop_staff', 'Shop Staff'),
    ]
    # Numeric admin access status (1-4)
    STATUS_CHOICES = [
        (1, 'Dev Admin'),
        (2, 'Super Admin'),
        (3, 'Billing Admin'),
        (4, 'Stock Admin'),
        (5, 'Shop Owner'),
        (6, 'Shop Staff'),
    ]
    ROLE_BY_STATUS = {
        1: 'dev_admin',
        2: 'super_admin',
        3: 'billing_admin',
        4: 'stock_admin',
        5: 'shop_owner',
        6: 'shop_staff',
    }
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='shop_owner')
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, default=6)
    phone = models.CharField(max_length=15, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    language = models.CharField(max_length=10, default='en')
    is_active_subscription = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'


def generate_12_digit_password():
    """Auto-generate a secure 12-digit numerical password."""
    return ''.join(secrets.choice(string.digits) for _ in range(12))
