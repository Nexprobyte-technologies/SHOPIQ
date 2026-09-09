from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('shops.urls')),
    path('api/', include('products.urls')),
    path('api/', include('billing.urls')),
    path('api/', include('analytics.urls')),
    path('api/', include('ai_insights.urls')),
    path('api/', include('operations.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
