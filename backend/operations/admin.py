from django.contrib import admin
from .models import Employee, EmployeeAttendance, StackEntry, PackDelivery


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['name', 'shop', 'designation', 'phone', 'is_active']
    list_filter = ['is_active', 'shop']


@admin.register(EmployeeAttendance)
class EmployeeAttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'status', 'check_in', 'check_out']
    list_filter = ['status', 'date']


@admin.register(StackEntry)
class StackEntryAdmin(admin.ModelAdmin):
    list_display = ['product', 'stack_type', 'quantity', 'confirm_status', 'created_at']
    list_filter = ['stack_type', 'confirm_status']


@admin.register(PackDelivery)
class PackDeliveryAdmin(admin.ModelAdmin):
    list_display = ['order_reference', 'customer_name', 'pack_status', 'delivery_status', 'created_at']
    list_filter = ['pack_status', 'delivery_status']
