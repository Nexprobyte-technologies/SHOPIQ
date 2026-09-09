from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count
from django.utils import timezone
from datetime import timedelta
from .models import DailySalesSummary, WeeklyTrend, MonthlyReport
from .serializers import DailySalesSummarySerializer, WeeklyTrendSerializer, MonthlyReportSerializer


class DailySalesSummaryViewSet(viewsets.ModelViewSet):
    queryset = DailySalesSummary.objects.all()
    serializer_class = DailySalesSummarySerializer
    permission_classes = [permissions.IsAuthenticated]


class WeeklyTrendViewSet(viewsets.ModelViewSet):
    queryset = WeeklyTrend.objects.all()
    serializer_class = WeeklyTrendSerializer
    permission_classes = [permissions.IsAuthenticated]


class MonthlyReportViewSet(viewsets.ModelViewSet):
    queryset = MonthlyReport.objects.all()
    serializer_class = MonthlyReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def overview(self, request):
        shop_id = request.query_params.get('shop_id')
        reports = MonthlyReport.objects.all()
        if shop_id:
            reports = reports.filter(shop_id=shop_id)
        totals = reports.aggregate(
            total_sales=Sum('total_sales'),
            total_purchases=Sum('total_purchases'),
            total_profit=Sum('gross_profit'),
            avg_margin=Avg('profit_margin'),
        )
        return Response(totals)
