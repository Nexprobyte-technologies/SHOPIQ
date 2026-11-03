from django.db import models

# Django manages these SQLite tables through its migrations.
class User(models.Model):
    id = models.CharField(primary_key=True, max_length=30)
    name = models.TextField()
    email = models.TextField(unique=True)
    password_hash = models.TextField(db_column="passwordHash")
    role = models.TextField(default="STORE_OWNER")
    created_at = models.DateTimeField(db_column="createdAt")

    class Meta:
        db_table = '"User"'


class Store(models.Model):
    id = models.CharField(primary_key=True, max_length=30)
    name = models.TextField()
    category = models.TextField()
    owner = models.OneToOneField(User, db_column="ownerId", on_delete=models.DO_NOTHING, related_name="store")
    created_at = models.DateTimeField(db_column="createdAt")

    class Meta:
        db_table = '"Store"'


class Customer(models.Model):
    id = models.CharField(primary_key=True, max_length=30)
    name = models.CharField(max_length=160)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=40, blank=True)
    created_at = models.DateTimeField(db_column="createdAt")

    class Meta:
        ordering = ["-created_at"]


class Payment(models.Model):
    id = models.CharField(primary_key=True, max_length=30)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="INR")
    status = models.CharField(max_length=20, default="PAID")
    payment_method = models.CharField(max_length=40, default="OTHER")
    reference = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(db_column="createdAt")

    class Meta:
        ordering = ["-created_at"]
