from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailySalesSummaryViewSet, WeeklyTrendViewSet, MonthlyReportViewSet

router = DefaultRouter()
router.register(r'daily', DailySalesSummaryViewSet, basename='daily-sales')
router.register(r'weekly', WeeklyTrendViewSet, basename='weekly-trends')
router.register(r'monthly', MonthlyReportViewSet, basename='monthly-reports')

urlpatterns = [
    path('', include(router.urls)),
]
