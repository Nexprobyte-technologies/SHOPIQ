from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count
from datetime import timedelta
from .models import Customer, Invoice, InvoiceItem, Payment
from .serializers import CustomerSerializer, InvoiceSerializer, InvoiceItemSerializer, PaymentSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id')
        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        return qs


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        shop_id = self.request.query_params.get('shop_id')
        status_filter = self.request.query_params.get('status')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')

        if shop_id:
            qs = qs.filter(shop_id=shop_id)
        if status_filter:
            qs = qs.filter(payment_status=status_filter)
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)
        return qs

    @action(detail=False, methods=['get'])
    def today_summary(self, request):
        shop_id = request.query_params.get('shop_id')
        today = timezone.now().date()
        invoices = Invoice.objects.filter(created_at__date=today)
        if shop_id:
            invoices = invoices.filter(shop_id=shop_id)
        summary = invoices.aggregate(
            total_sales=Sum('total_amount'),
            total_transactions=Count('id'),
            total_collected=Sum('paid_amount'),
        )
        return Response(summary)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        shop_id = request.query_params.get('shop_id')
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)

        base = Invoice.objects.all()
        if shop_id:
            base = base.filter(shop_id=shop_id)

        today_sales = base.filter(created_at__date=today).aggregate(
            total=Sum('total_amount'), count=Count('id'))
        week_sales = base.filter(created_at__date__gte=week_ago).aggregate(total=Sum('total_amount'))
        month_sales = base.filter(created_at__date__gte=month_ago).aggregate(total=Sum('total_amount'))
        pending = base.filter(payment_status__in=['unpaid', 'partial']).aggregate(total=Sum('total_amount'))

        return Response({
            'today': today_sales,
            'this_week': week_sales,
            'this_month': month_sales,
            'pending_payments': pending,
        })


class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
