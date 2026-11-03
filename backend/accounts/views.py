import os
import secrets
import string
from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation

import bcrypt
import jwt
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from django.core.validators import validate_email
from django.db import IntegrityError, transaction
from django.db.models import Count, Max, Q, Sum
from django.db.models.functions import TruncDate
from django.http import JsonResponse
from django.utils import timezone as django_timezone
from django.utils.dateparse import parse_date
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Customer, Payment, Store, User


def fail(message, status):
    return Response({"statusCode": status, "message": message, "error": "Bad Request" if status == 400 else "Unauthorized" if status == 401 else "Conflict"}, status=status)


def body(request):
    return request.data if isinstance(request.data, dict) else {}


def token_for(user):
    return jwt.encode({"sub": user["id"], "email": user["email"], "role": user["role"], "iat": datetime.now(timezone.utc), "exp": datetime.now(timezone.utc) + timedelta(days=1)}, os.getenv("JWT_SECRET", "dev-only-change-me"), algorithm="HS256")


def session(user):
    return Response({"accessToken": token_for(user), "user": user})


def owner_payload(user, with_store=True):
    result = {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    if with_store:
        try:
            store = user.store
            result["store"] = {"id": store.id, "name": store.name, "category": store.category}
        except Store.DoesNotExist:
            result["store"] = None
    return result


def cuid():
    alphabet = string.ascii_lowercase + string.digits
    return "c" + "".join(secrets.choice(alphabet) for _ in range(24))


@api_view(["POST"])
def register(request):
    data = body(request)
    name, email, password = data.get("name"), data.get("email"), data.get("password")
    store_name, category = data.get("storeName"), data.get("storeCategory")
    if not all(isinstance(x, str) for x in (name, email, password, store_name, category)) or len(name.strip()) < 2 or len(store_name.strip()) < 2 or len(category.strip()) < 2 or len(password) < 8 or "@" not in email:
        return fail("Please provide a valid name, email, password, store name, and category.", 400)
    email = email.strip().lower()
    try:
        with transaction.atomic():
            user = User.objects.create(id=cuid(), name=name.strip(), email=email, password_hash=bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode(), role="STORE_OWNER", created_at=django_timezone.now())
            Store.objects.create(id=cuid(), name=store_name.strip(), category=category.strip(), owner=user, created_at=django_timezone.now())
        return session(owner_payload(user))
    except IntegrityError:
        return fail("An account with this email already exists.", 409)


@api_view(["POST"])
def login(request):
    data = body(request)
    email, password = data.get("email"), data.get("password")
    if not isinstance(email, str) or not isinstance(password, str):
        return fail("Invalid email or password.", 401)
    try:
        user = User.objects.get(email=email.strip().lower())
        valid = bcrypt.checkpw(password.encode(), user.password_hash.encode())
    except (User.DoesNotExist, ValueError):
        valid = False
        user = None
    if not valid or user.role != "STORE_OWNER":
        return fail("Invalid email or password.", 401)
    return session(owner_payload(user))


@api_view(["POST"])
def google_login(request):
    credential = body(request).get("credential")
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        return fail("Google sign-in is not configured on this server.", 401)
    try:
        profile = id_token.verify_oauth2_token(credential, google_requests.Request(), client_id)
        if not profile.get("email_verified"):
            raise ValueError("Unverified email")
        user = User.objects.get(email=profile["email"].lower(), role="STORE_OWNER")
        user.store
    except Exception:
        return fail("No verified store owner account was found for this Google email.", 401)
    return session(owner_payload(user))


@api_view(["POST"])
def admin_login(request):
    data = body(request)
    configured_email = os.getenv("SUPER_ADMIN_EMAIL", "").strip().lower()
    configured_password = os.getenv("SUPER_ADMIN_PASSWORD", "")
    email, password = data.get("email", ""), data.get("password", "")
    if not configured_email or not configured_password:
        return fail("Super admin sign-in is not configured.", 401)
    if not isinstance(email, str) or not isinstance(password, str) or not secrets.compare_digest(email.strip().lower(), configured_email) or not secrets.compare_digest(password, configured_password):
        return fail("Invalid admin email or password.", 401)
    return session({"id": f"super-admin:{configured_email}", "name": "Super Admin", "email": configured_email, "role": "SUPER_ADMIN"})


def authorized_user(request, role):
    authorization = request.headers.get("Authorization", "")
    if not authorization.startswith("Bearer "):
        return None
    try:
        payload = jwt.decode(authorization[7:], os.getenv("JWT_SECRET", "dev-only-change-me"), algorithms=["HS256"])
        return payload if payload.get("role") == role else None
    except jwt.PyJWTError:
        return None


@api_view(["GET"])
def me(request):
    payload = authorized_user(request, "STORE_OWNER")
    if not payload:
        return fail("Please sign in to continue.", 401)
    try:
        user = User.objects.get(id=payload["sub"], role="STORE_OWNER")
        store = user.store
    except (User.DoesNotExist, Store.DoesNotExist, KeyError):
        return fail("Store owner account was not found.", 401)
    result = owner_payload(user, with_store=False)
    result["store"] = {"id": store.id, "name": store.name, "category": store.category, "createdAt": store.created_at.isoformat()}
    return Response(result)


@api_view(["GET"])
def admin_overview(request):
    if not authorized_user(request, "SUPER_ADMIN"):
        return fail("Super admin access is required.", 401)
    today = django_timezone.localdate()
    start = today - timedelta(days=6)
    new_stores = list(Store.objects.filter(created_at__date__gte=start).values_list("created_at", flat=True))
    growth = {row["day"]: row["count"] for row in Store.objects.filter(created_at__date__gte=start).annotate(day=TruncDate("created_at")).values("day").annotate(count=Count("id"))}
    recent = Store.objects.select_related("owner").order_by("-created_at")[:10]
    return Response({
        "ownerCount": User.objects.filter(role="STORE_OWNER").count(),
        "storeCount": Store.objects.count(),
        "storesAddedLast7Days": len(new_stores),
        "storeGrowth": [{"day": (start + timedelta(days=i)).strftime("%a"), "count": growth.get(start + timedelta(days=i), 0)} for i in range(7)],
        "recentStores": [{"id": s.id, "name": s.name, "category": s.category, "createdAt": s.created_at.isoformat(), "owner": {"name": s.owner.name, "email": s.owner.email}} for s in recent],
    })


def admin_page(request, queryset, serializer):
    try:
        page_number = max(1, int(request.query_params.get("page", "1")))
        page_size = min(100, max(1, int(request.query_params.get("pageSize", "10"))))
    except (TypeError, ValueError):
        page_number, page_size = 1, 10
    paginator = Paginator(queryset, page_size)
    page = paginator.get_page(page_number)
    return Response({
        "results": [serializer(item) for item in page.object_list],
        "total": paginator.count,
        "page": page.number,
        "pageSize": page_size,
        "totalPages": paginator.num_pages,
    })


def admin_customer_data(customer):
    paid = customer.payments.filter(status="PAID").aggregate(total=Sum("amount"), last_paid=Max("created_at"), count=Count("id"))
    return {
        "id": customer.id,
        "customerId": customer.id,
        "name": customer.name,
        "email": customer.email,
        "phone": customer.phone,
        "createdAt": customer.created_at.isoformat(),
        "paidTotal": str(paid["total"] or Decimal("0.00")),
        "paidPaymentCount": paid["count"],
        "lastPaidAt": paid["last_paid"].isoformat() if paid["last_paid"] else None,
    }


def admin_payment_data(payment):
    return {
        "id": payment.id,
        "customerId": payment.customer_id,
        "customerName": payment.customer.name,
        "customerEmail": payment.customer.email,
        "amount": str(payment.amount),
        "currency": payment.currency,
        "status": payment.status,
        "paymentMethod": payment.payment_method,
        "reference": payment.reference,
        "createdAt": payment.created_at.isoformat(),
    }


def admin_user_data(user):
    try:
        store = user.store
        store_data = {"id": store.id, "name": store.name, "category": store.category}
    except Store.DoesNotExist:
        store_data = None
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "createdAt": user.created_at.isoformat(), "store": store_data}


def filter_admin_dates(queryset, params, field="created_at"):
    start_date = parse_date(params.get("dateFrom", "")) if params.get("dateFrom") else None
    end_date = parse_date(params.get("dateTo", "")) if params.get("dateTo") else None
    if start_date:
        queryset = queryset.filter(**{f"{field}__date__gte": start_date})
    if end_date:
        queryset = queryset.filter(**{f"{field}__date__lte": end_date})
    return queryset


@api_view(["GET"])
def admin_stores(request):
    if not authorized_user(request, "SUPER_ADMIN"):
        return fail("Super admin access is required.", 401)
    search = request.query_params.get("search", "").strip()
    id_search = request.query_params.get("id", "").strip()
    stores = Store.objects.select_related("owner").order_by("-created_at")
    if search:
        stores = stores.filter(Q(name__icontains=search) | Q(category__icontains=search) | Q(owner__name__icontains=search) | Q(owner__email__icontains=search) | Q(id__icontains=search))
    if id_search:
        stores = stores.filter(id__icontains=id_search)
    category = request.query_params.get("status", "").strip()
    if category:
        stores = stores.filter(category__icontains=category)
    stores = filter_admin_dates(stores, request.query_params)
    return admin_page(request, stores, lambda store: {"id": store.id, "name": store.name, "category": store.category, "createdAt": store.created_at.isoformat(), "owner": {"name": store.owner.name, "email": store.owner.email}})


@api_view(["GET", "POST"])
def admin_users(request):
    if not authorized_user(request, "SUPER_ADMIN"):
        return fail("Super admin access is required.", 401)
    if request.method == "POST":
        data = body(request)
        name, email, password = data.get("name"), data.get("email"), data.get("password")
        store_name, category = data.get("storeName"), data.get("storeCategory")
        if not all(isinstance(value, str) for value in (name, email, password, store_name, category)) or len(name.strip()) < 2 or len(password) < 8 or len(store_name.strip()) < 2 or len(category.strip()) < 2:
            return fail("Enter a name, email, password of at least 8 characters, store name, and category.", 400)
        email = email.strip().lower()
        try:
            validate_email(email)
            with transaction.atomic():
                user = User.objects.create(id=cuid(), name=name.strip(), email=email, password_hash=bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode(), role="STORE_OWNER", created_at=django_timezone.now())
                Store.objects.create(id=cuid(), name=store_name.strip(), category=category.strip(), owner=user, created_at=django_timezone.now())
        except ValidationError:
            return fail("Enter a valid owner email address.", 400)
        except IntegrityError:
            return fail("A user with this email already exists.", 409)
        return Response(admin_user_data(user), status=201)
    search = request.query_params.get("search", "").strip()
    users = User.objects.filter(role="STORE_OWNER").order_by("-created_at")
    if search:
        users = users.filter(Q(id__icontains=search) | Q(name__icontains=search) | Q(email__icontains=search) | Q(store__name__icontains=search))
    if request.query_params.get("id"):
        users = users.filter(id__icontains=request.query_params["id"].strip())
    users = filter_admin_dates(users, request.query_params)
    return admin_page(request, users, admin_user_data)


@api_view(["PATCH", "PUT", "DELETE"])
def admin_user_detail(request, user_id):
    if not authorized_user(request, "SUPER_ADMIN"):
        return fail("Super admin access is required.", 401)
    try:
        user = User.objects.get(id=user_id, role="STORE_OWNER")
    except User.DoesNotExist:
        return fail("Store owner was not found.", 404)
    if request.method == "DELETE":
        if Store.objects.filter(owner=user).exists():
            return fail("Remove this owner's store before deleting the account.", 409)
        user.delete()
        return Response({"deleted": True, "id": user_id})
    data = body(request)
    name = data.get("name", user.name)
    email = data.get("email", user.email)
    if not isinstance(name, str) or len(name.strip()) < 2 or not isinstance(email, str):
        return fail("Enter a valid owner name and email.", 400)
    email = email.strip().lower()
    try:
        validate_email(email)
        user.name = name.strip()
        user.email = email
        user.save(update_fields=["name", "email"])
    except ValidationError:
        return fail("Enter a valid email address.", 400)
    except IntegrityError:
        return fail("Another account already uses this email address.", 409)
    return Response(admin_user_data(user))


@api_view(["GET", "POST"])
def admin_customers(request):
    if not authorized_user(request, "SUPER_ADMIN"):
        return fail("Super admin access is required.", 401)
    if request.method == "GET":
        search = request.query_params.get("search", "").strip()
        customers = Customer.objects.all().order_by("-created_at")
        if search:
            customers = customers.filter(Q(id__icontains=search) | Q(name__icontains=search) | Q(email__icontains=search) | Q(phone__icontains=search))
        if request.query_params.get("id"):
            customers = customers.filter(id__icontains=request.query_params["id"].strip())
        paid_status = request.query_params.get("status", "").strip().upper()
        if paid_status == "PAID":
            customers = customers.filter(payments__status="PAID").distinct()
        elif paid_status == "UNPAID":
            customers = customers.exclude(payments__status="PAID")
        customers = filter_admin_dates(customers, request.query_params)
        return admin_page(request, customers, admin_customer_data)
    data = body(request)
    name, email = data.get("name"), data.get("email")
    phone = data.get("phone", "")
    if not isinstance(name, str) or len(name.strip()) < 2 or not isinstance(email, str) or not isinstance(phone, str):
        return fail("Enter a customer name, email, and valid phone value.", 400)
    email = email.strip().lower()
    try:
        validate_email(email)
        customer = Customer.objects.create(id=cuid(), name=name.strip(), email=email, phone=phone.strip(), created_at=django_timezone.now())
    except ValidationError:
        return fail("Enter a valid customer email address.", 400)
    except IntegrityError:
        return fail("A customer with this email already exists.", 409)
    return Response(admin_customer_data(customer), status=201)


@api_view(["PATCH", "PUT", "DELETE"])
def admin_customer_detail(request, customer_id):
    if not authorized_user(request, "SUPER_ADMIN"):
        return fail("Super admin access is required.", 401)
    try:
        customer = Customer.objects.get(id=customer_id)
    except Customer.DoesNotExist:
        return fail("Customer was not found.", 404)
    if request.method == "DELETE":
        if customer.payments.exists():
            return fail("Delete this customer's payment records before deleting the customer.", 409)
        customer.delete()
        return Response({"deleted": True, "id": customer_id})
    data = body(request)
    name, email, phone = data.get("name", customer.name), data.get("email", customer.email), data.get("phone", customer.phone)
    if not isinstance(name, str) or len(name.strip()) < 2 or not isinstance(email, str) or not isinstance(phone, str):
        return fail("Enter a valid customer name, email, and phone.", 400)
    email = email.strip().lower()
    try:
        validate_email(email)
        customer.name, customer.email, customer.phone = name.strip(), email, phone.strip()
        customer.save(update_fields=["name", "email", "phone"])
    except ValidationError:
        return fail("Enter a valid customer email address.", 400)
    except IntegrityError:
        return fail("A customer with this email already exists.", 409)
    return Response(admin_customer_data(customer))


@api_view(["GET", "POST"])
def admin_payments(request):
    if not authorized_user(request, "SUPER_ADMIN"):
        return fail("Super admin access is required.", 401)
    if request.method == "GET":
        search = request.query_params.get("search", "").strip()
        status = request.query_params.get("status", "").strip().upper()
        payments = Payment.objects.select_related("customer").order_by("-created_at")
        if search:
            payments = payments.filter(Q(id__icontains=search) | Q(reference__icontains=search) | Q(customer__id__icontains=search) | Q(customer__name__icontains=search) | Q(customer__email__icontains=search))
        if status:
            payments = payments.filter(status=status)
        if request.query_params.get("id"):
            payments = payments.filter(id__icontains=request.query_params["id"].strip())
        payments = filter_admin_dates(payments, request.query_params)
        return admin_page(request, payments, admin_payment_data)
    data = body(request)
    customer_id = data.get("customerId")
    try:
        customer = Customer.objects.get(id=customer_id)
        amount = Decimal(str(data.get("amount", "")))
    except (Customer.DoesNotExist, InvalidOperation, TypeError, ValueError):
        return fail("Choose a valid customer and payment amount.", 400)
    currency = str(data.get("currency", "INR")).strip().upper()
    status = str(data.get("status", "PAID")).strip().upper()
    method = str(data.get("paymentMethod", "OTHER")).strip().upper()
    reference = str(data.get("reference", "")).strip()
    if amount <= 0 or len(currency) != 3 or status not in {"PAID", "PENDING", "FAILED", "REFUNDED"} or not method or len(method) > 40 or len(reference) > 120:
        return fail("Enter a positive amount and valid payment details.", 400)
    payment = Payment.objects.create(id=cuid(), customer=customer, amount=amount, currency=currency, status=status, payment_method=method, reference=reference, created_at=django_timezone.now())
    return Response(admin_payment_data(payment), status=201)


@api_view(["PATCH", "PUT", "DELETE"])
def admin_payment_detail(request, payment_id):
    if not authorized_user(request, "SUPER_ADMIN"):
        return fail("Super admin access is required.", 401)
    try:
        payment = Payment.objects.select_related("customer").get(id=payment_id)
    except Payment.DoesNotExist:
        return fail("Payment was not found.", 404)
    if request.method == "DELETE":
        payment.delete()
        return Response({"deleted": True, "id": payment_id})
    data = body(request)
    customer_id = data.get("customerId", payment.customer_id)
    try:
        customer = Customer.objects.get(id=customer_id)
        amount = Decimal(str(data.get("amount", payment.amount)))
    except (Customer.DoesNotExist, InvalidOperation, TypeError, ValueError):
        return fail("Choose a valid customer and payment amount.", 400)
    currency = str(data.get("currency", payment.currency)).strip().upper()
    status = str(data.get("status", payment.status)).strip().upper()
    method = str(data.get("paymentMethod", payment.payment_method)).strip().upper()
    reference = str(data.get("reference", payment.reference)).strip()
    if amount <= 0 or len(currency) != 3 or status not in {"PAID", "PENDING", "FAILED", "REFUNDED"} or not method or len(method) > 40 or len(reference) > 120:
        return fail("Enter a positive amount and valid payment details.", 400)
    payment.customer, payment.amount, payment.currency = customer, amount, currency
    payment.status, payment.payment_method, payment.reference = status, method, reference
    payment.save(update_fields=["customer", "amount", "currency", "status", "payment_method", "reference"])
    return Response(admin_payment_data(payment))
