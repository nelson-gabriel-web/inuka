from django.urls import path
from . import views

app_name = 'pedidos'

urlpatterns = [
    path('criar/', views.criar_pedido, name='criar'),
    path('<int:pedido_id>/', views.rastrear_pedido, name='rastrear'),
    path('revendedor/<int:revendedor_id>/', views.listar_pedidos_revendedor, name='listar'),
    path('<int:pedido_id>/atualizar-status/', views.atualizar_status_pedido, name='atualizar_status'),
]