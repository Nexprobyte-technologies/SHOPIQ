import os
import secrets
import string
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from django.db import IntegrityError, transaction
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.http import JsonResponse
from django.utils import timezone as django_timezone
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Store, User


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
