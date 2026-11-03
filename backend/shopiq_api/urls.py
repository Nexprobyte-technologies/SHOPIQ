from django.http import JsonResponse
from django.urls import path
from accounts.views import admin_login, admin_overview, google_login, login, me, register

urlpatterns = [
    path("", lambda request: JsonResponse({"service": "SHOPIQ API", "status": "ok"})),
    path("auth/register", register),
    path("auth/login", login),
    path("auth/google", google_login),
    path("auth/admin/login", admin_login),
    path("auth/admin/overview", admin_overview),
    path("auth/me", me),
]
