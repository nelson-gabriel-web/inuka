from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/revendedores/', include('revendedores.urls')),
    path('api/produtos/', include('produtos.urls')),
    path('api/clientes/', include('clientes.urls')),
    path('api/encomendas/', include('encomendas.urls')),
]