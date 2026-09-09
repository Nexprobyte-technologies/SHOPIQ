from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('DJANGO_SECRET_KEY', default='django-insecure-j15-+28zn973yxdb8*na-_v6=102&fy5$ok%3v6v*tj@9khpey')

DEBUG = config('DJANGO_DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'channels',
    'accounts',
    'shops',
    'products',
    'billing',
    'analytics',
    'ai_insights',
    'operations',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend_api.wsgi.application'
ASGI_APPLICATION = 'backend_api.asgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='shopiq_db'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default='postgres'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'accounts.User'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': __import__('datetime').timedelta(hours=12),
    'REFRESH_TOKEN_LIFETIME': __import__('datetime').timedelta(days=7),
}

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

# AI Engine Config
AI_ENGINE_URL = config('AI_ENGINE_URL', default='http://localhost:8001')

# n8n Config
N8N_WEBHOOK_URL = config('N8N_WEBHOOK_URL', default='http://localhost:5678/webhook')


# ============================================================
# Jazzmin - Modern Django Admin UI
# ============================================================
JAZZMIN_SETTINGS = {
    "site_title": "SHOPIQ Admin",
    "site_header": "SHOPIQ",
    "site_brand": "SHOPIQ Admin",
    "site_logo_classes": "img-circle",
    "site_icon": "fas fa-store",
    "welcome_sign": "Welcome to SHOPIQ Admin — Your AI Business OS",
    "copyright": "© 2026 SHOPIQ",
    "search_model": ["shops.Shop", "products.Product", "billing.Invoice"],
    "topmenu_links": [
        {"name": "Dashboard", "url": "admin:index", "permissions": ["auth.view_user"]},
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": ["auth.Group"],
    "order_with_respect_to": ["accounts", "shops", "products", "billing", "analytics", "ai_insights"],
    "icons": {
        "auth.User": "fas fa-user",
        "accounts.User": "fas fa-user",
        "shops.Shop": "fas fa-store",
        "shops.ShopStaff": "fas fa-users",
        "products.Category": "fas fa-tags",
        "products.Supplier": "fas fa-truck",
        "products.Product": "fas fa-box",
        "products.StockMovement": "fas fa-arrows-alt-v",
        "billing.Customer": "fas fa-user-friends",
        "billing.Invoice": "fas fa-receipt",
        "billing.InvoiceItem": "fas fa-shopping-basket",
        "billing.Payment": "fas fa-credit-card",
        "analytics.DailySalesSummary": "fas fa-chart-bar",
        "analytics.WeeklyTrend": "fas fa-chart-line",
        "analytics.MonthlyReport": "fas fa-calendar-alt",
        "ai_insights.AIInsight": "fas fa-lightbulb",
        "ai_insights.AutoReorder": "fas fa-sync-alt",
        "ai_insights.CustomerPrediction": "fas fa-user-clock",
        "operations.Employee": "fas fa-id-badge",
        "operations.EmployeeAttendance": "fas fa-calendar-check",
        "operations.StackEntry": "fas fa-boxes",
        "operations.PackDelivery": "fas fa-truck",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    "related_modal_active": False,
    "custom_css": None,
    "custom_js": None,
    "show_ui_builder": True,
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "auth.group": "vertical_tabs",
    },
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-primary",
    "accent": "accent-primary",
    "navbar": "navbar-primary navbar-dark",
    "no_navbar_border": False,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "darkly",
    "default_theme_mode": "dark",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
}

