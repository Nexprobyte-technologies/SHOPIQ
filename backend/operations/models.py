from django.db import models
from shops.models import Shop
from products.models import Product, Supplier
from accounts.models import User
import uuid


class Employee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='employees')
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    designation = models.CharField(max_length=100, blank=True)
    salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    joined_on = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employees'

    def __str__(self):
        return self.name


class EmployeeAttendance(models.Model):
    ATTENDANCE_STATUS = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('half_day', 'Half Day'),
        ('leave', 'Leave'),
        ('late', 'Late'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='attendances')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=ATTENDANCE_STATUS, default='present')
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)
    overtime_hours = models.FloatField(default=0)
    notes = models.TextField(blank=True)
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employee_attendances'
        unique_together = ['employee', 'date']

    def __str__(self):
        return f"{self.employee.name} - {self.date} - {self.status}"


class StackEntry(models.Model):
    """Stack received / stock increase & decrease records."""
    STACK_TYPES = [
        ('received', 'Stack Received'),
        ('increase', 'Stack Increase'),
        ('decrease', 'Stack Decrease'),
        ('adjustment', 'Adjustment'),
        ('return', 'Return'),
    ]
    CONFIRM_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='stack_entries')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stack_entries')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='stack_entries')
    stack_type = models.CharField(max_length=20, choices=STACK_TYPES, default='received')
    quantity = models.IntegerField()
    unit = models.CharField(max_length=20, default='pcs')
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    confirm_status = models.CharField(max_length=20, choices=CONFIRM_STATUS, default='pending')
    confirmed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='confirmed_stacks')
    confirmed_at = models.DateTimeField(null=True, blank=True)
    invoice_reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_stacks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stack_entries'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name} x{self.quantity} ({self.stack_type})"


class PackDelivery(models.Model):
    """Pack and delivery tracking with dropdown statuses."""
    PACK_READY_STATUS = [
        ('not_packed', 'Not Packed'),
        ('packed', 'Packed'),
        ('ready_for_dispatch', 'Ready for Dispatch'),
        ('dispatched', 'Dispatched'),
    ]
    DELIVERY_STATUS = [
        ('pending', 'Pending'),
        ('in_transit', 'In Transit'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('failed', 'Delivery Failed'),
        ('returned', 'Returned'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='pack_deliveries')
    order_reference = models.CharField(max_length=100, unique=True)
    customer_name = models.CharField(max_length=200, blank=True)
    customer_phone = models.CharField(max_length=15, blank=True)
    delivery_address = models.TextField(blank=True)
    delivery_city = models.CharField(max_length=100, blank=True)
    items = models.JSONField(default=list)
    total_quantity = models.IntegerField(default=0)
    pack_status = models.CharField(max_length=20, choices=PACK_READY_STATUS, default='not_packed')
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS, default='pending')
    courier_name = models.CharField(max_length=100, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    delivery_agent = models.CharField(max_length=100, blank=True)
    packed_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pack_deliveries'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order_reference} - {self.pack_status}/{self.delivery_status}"
