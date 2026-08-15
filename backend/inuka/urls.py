from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/revendedores/', include('revendedores.urls')),
    path('api/produtos/', include('produtos.urls')),
    path('api/pedidos/', include('pedidos.urls')),
    path('api/transacoes/', include('transacoes.urls')),
    path('api/anuncios/', include('anuncios.urls')),
]