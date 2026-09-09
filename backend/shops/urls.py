from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShopViewSet, ShopStaffViewSet

router = DefaultRouter()
router.register(r'shops', ShopViewSet, basename='shops')
router.register(r'staff', ShopStaffViewSet, basename='staff')

urlpatterns = [
    path('', include(router.urls)),
]
