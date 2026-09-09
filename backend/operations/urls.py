from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeViewSet,
    EmployeeAttendanceViewSet,
    StackEntryViewSet,
    PackDeliveryViewSet,
)

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employees')
router.register(r'attendances', EmployeeAttendanceViewSet, basename='attendances')
router.register(r'stacks', StackEntryViewSet, basename='stacks')
router.register(r'deliveries', PackDeliveryViewSet, basename='deliveries')

urlpatterns = [
    path('', include(router.urls)),
]
