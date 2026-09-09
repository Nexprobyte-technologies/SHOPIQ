from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Employee, EmployeeAttendance, StackEntry, PackDelivery
from .serializers import (
    EmployeeSerializer,
    EmployeeAttendanceSerializer,
    StackEntrySerializer,
    StackEntryConfirmSerializer,
    PackDeliverySerializer,
)


# ---- Custom permission to restrict by numeric status ----
def is_dev(user):
    return user.is_superuser or getattr(user, 'status', None) == 1


def _resolve_shop(request_user):
    """Pick the requesting user's shop, falling back to the first shop in the system."""
    from shops.models import Shop as ShopModel
    membership = request_user.shop_memberships.filter(is_active=True).first()
    if membership:
        return membership.shop
    return ShopModel.objects.first()


class EmployeePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        u = request.user
        if not u.is_authenticated:
            return False
        status_no = getattr(u, 'status', None)
        # Dev(1) + Super(2) manage employees/attendance
        if request.method in ('GET',):
            return is_dev(u) or status_no == 2
        return is_dev(u) or status_no == 2


class StackPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        u = request.user
        if not u.is_authenticated:
            return False
        status_no = getattr(u, 'status', None)
        # Dev(1), Super(2), Stock(4) can manage stack
        return is_dev(u) or status_no in (2, 4)


class PackDeliveryPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        u = request.user
        if not u.is_authenticated:
            return False
        status_no = getattr(u, 'status', None)
        # Dev(1), Super(2), Stock(4) can manage pack & delivery
        return is_dev(u) or status_no in (2, 4)


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated, EmployeePermission]

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id')
        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(shop=_resolve_shop(self.request.user))


class EmployeeAttendanceViewSet(viewsets.ModelViewSet):
    queryset = EmployeeAttendance.objects.all()
    serializer_class = EmployeeAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated, EmployeePermission]

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id')
        date = self.request.query_params.get('date')
        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        if date:
            qs = qs.filter(date=date)
        return qs

    def perform_create(self, serializer):
        serializer.save(marked_by=self.request.user, shop=_resolve_shop(self.request.user))


class StackEntryViewSet(viewsets.ModelViewSet):
    queryset = StackEntry.objects.all()
    serializer_class = StackEntrySerializer
    permission_classes = [permissions.IsAuthenticated, StackPermission]

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id')
        stack_type = self.request.query_params.get('stack_type')
        confirm_status = self.request.query_params.get('confirm_status')
        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        if stack_type:
            qs = qs.filter(stack_type=stack_type)
        if confirm_status:
            qs = qs.filter(confirm_status=confirm_status)
        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, shop=_resolve_shop(self.request.user))

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Stock admin approves/confirms a stack entry."""
        stack = self.get_object()
        serializer = StackEntryConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        stack.confirm_status = serializer.validated_data['confirm_status']
        stack.confirmed_by = request.user
        stack.confirmed_at = timezone.now()
        stack.save()
        # If confirmed received/increase => bump product stock
        if stack.confirm_status == 'confirmed' and stack.stack_type in ('received', 'increase', 'adjustment'):
            product = stack.product
            if stack.stack_type in ('received', 'increase'):
                product.stock_quantity += stack.quantity
            else:
                product.stock_quantity += stack.quantity  # adjustment adds too
            product.save()
        elif stack.confirm_status == 'confirmed' and stack.stack_type in ('decrease', 'return'):
            product = stack.product
            product.stock_quantity = max(0, product.stock_quantity - stack.quantity)
            product.save()
        return Response(StackEntrySerializer(stack).data)


class PackDeliveryViewSet(viewsets.ModelViewSet):
    queryset = PackDelivery.objects.all()
    serializer_class = PackDeliverySerializer
    permission_classes = [permissions.IsAuthenticated, PackDeliveryPermission]

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id')
        pack_status = self.request.query_params.get('pack_status')
        delivery_status = self.request.query_params.get('delivery_status')
        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        if pack_status:
            qs = qs.filter(pack_status=pack_status)
        if delivery_status:
            qs = qs.filter(delivery_status=delivery_status)
        return qs

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user, shop=_resolve_shop(self.request.user))

    def perform_update(self, serializer):
        data = serializer.validated_data
        if data.get('pack_status') in ('packed', 'ready_for_dispatch') and not self.get_object().packed_at:
            serializer.save(updated_by=self.request.user, packed_at=timezone.now())
        elif data.get('delivery_status') == 'delivered' and not self.get_object().delivered_at:
            serializer.save(updated_by=self.request.user, delivered_at=timezone.now())
        else:
            serializer.save(updated_by=self.request.user)