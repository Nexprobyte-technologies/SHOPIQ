from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIInsightViewSet, AutoReorderViewSet, CustomerPredictionViewSet

router = DefaultRouter()
router.register(r'insights', AIInsightViewSet, basename='ai-insights')
router.register(r'reorders', AutoReorderViewSet, basename='auto-reorders')
router.register(r'predictions', CustomerPredictionViewSet, basename='customer-predictions')

urlpatterns = [
    path('', include(router.urls)),
]
