from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/revendedores/', include('revendedores.urls')),
    path('api/produtos/', include('produtos.urls')),
    path('api/pedidos/', include('pedidos.urls')),
    path('api/transacoes/', include('transacoes.urls')),
    path('api/anuncios/', include('anuncios.urls')),
]

# Servir imagens em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)