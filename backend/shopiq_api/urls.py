from django.http import JsonResponse
from django.urls import path
from accounts.views import admin_customer_detail, admin_customers, admin_login, admin_overview, admin_payment_detail, admin_payments, admin_stores, admin_user_detail, admin_users, google_login, login, me, register

urlpatterns = [
    path("", lambda request: JsonResponse({"service": "SHOPIQ API", "status": "ok"})),
    path("auth/register", register),
    path("auth/login", login),
    path("auth/google", google_login),
    path("auth/admin/login", admin_login),
    path("auth/admin/overview", admin_overview),
    path("auth/admin/users", admin_users),
    path("auth/admin/users/<str:user_id>", admin_user_detail),
    path("auth/admin/stores", admin_stores),
    path("auth/admin/customers", admin_customers),
    path("auth/admin/customers/<str:customer_id>", admin_customer_detail),
    path("auth/admin/payments", admin_payments),
    path("auth/admin/payments/<str:payment_id>", admin_payment_detail),
    path("auth/me", me),
]
