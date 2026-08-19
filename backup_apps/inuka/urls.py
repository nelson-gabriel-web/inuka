from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

from clientes.views import ClienteViewSet

# Router para API
router = routers.DefaultRouter()
router.register(r'clientes', ClienteViewSet, basename='clientes')

# Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="INUKA API",
        default_version='v1',
        description="API da plataforma INUKA",
    ),
    public=True,
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API
    path('api/', include(router.urls)),
    
    # API Docs
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/docs/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Apps
    path('api/clientes/', include('clientes.urls')),
    path('api/encomendas/', include('encomendas.urls')),
    path('api/produtos/', include('produtos.urls')),
    path('api/revendedores/', include('revendedores.urls')),
]

# Media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)