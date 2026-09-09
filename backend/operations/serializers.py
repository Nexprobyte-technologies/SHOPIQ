from rest_framework import serializers
from .models import Employee, EmployeeAttendance, StackEntry, PackDelivery
from products.models import Product, Supplier


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'shop', 'name', 'phone', 'email', 'designation', 'salary',
                  'joined_on', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'shop': {'required': False}}


class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model = EmployeeAttendance
        fields = ['id', 'shop', 'employee', 'employee_name', 'date', 'status',
                  'check_in', 'check_out', 'overtime_hours', 'notes', 'marked_by',
                  'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'shop': {'required': False}}


class StackEntrySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True, default=None)
    confirm_status_display = serializers.CharField(source='get_confirm_status_display', read_only=True)
    stack_type_display = serializers.CharField(source='get_stack_type_display', read_only=True)

    class Meta:
        model = StackEntry
        fields = ['id', 'shop', 'product', 'product_name', 'supplier', 'supplier_name',
                  'stack_type', 'stack_type_display', 'quantity', 'unit', 'unit_cost',
                  'total_value', 'confirm_status', 'confirm_status_display',
                  'confirmed_by', 'confirmed_at', 'invoice_reference', 'notes',
                  'created_by', 'created_at']
        read_only_fields = ['id', 'created_at', 'total_value', 'confirmed_at']
        extra_kwargs = {'shop': {'required': False}}

    def validate(self, attrs):
        quantity = attrs.get('quantity', self.instance.quantity if self.instance else 0)
        unit_cost = attrs.get('unit_cost', self.instance.unit_cost if self.instance else 0)
        attrs['total_value'] = float(quantity) * float(unit_cost)
        return attrs


class StackEntryConfirmSerializer(serializers.Serializer):
    confirm_status = serializers.ChoiceField(choices=StackEntry.CONFIRM_STATUS)


class PackDeliverySerializer(serializers.ModelSerializer):
    pack_status_display = serializers.CharField(source='get_pack_status_display', read_only=True)
    delivery_status_display = serializers.CharField(source='get_delivery_status_display', read_only=True)

    class Meta:
        model = PackDelivery
        fields = ['id', 'shop', 'order_reference', 'customer_name', 'customer_phone',
                  'delivery_address', 'delivery_city', 'items', 'total_quantity',
                  'pack_status', 'pack_status_display', 'delivery_status',
                  'delivery_status_display', 'courier_name', 'tracking_number',
                  'delivery_agent', 'packed_at', 'delivered_at', 'notes',
                  'updated_by', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'shop': {'required': False}}
