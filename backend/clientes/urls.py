from django.urls import path
from . import views

urlpatterns = [
    path('revendedor/<int:revendedor_id>/', views.listar_clientes, name='listar'),
    path('criar/', views.criar_cliente, name='criar'),
    path('<int:cliente_id>/', views.detalhes_cliente, name='detalhes'),
    path('<int:cliente_id>/atualizar/', views.atualizar_cliente, name='atualizar'),
    path('pagamento/', views.registar_pagamento, name='registar_pagamento'),
]