from django.urls import path
from . import views

urlpatterns = [
    path('revendedor/<int:revendedor_id>/', views.listar_encomendas, name='listar'),
    path('criar/', views.criar_encomenda, name='criar'),
    path('<int:encomenda_id>/', views.detalhes_encomenda, name='detalhes'),
    path('<int:encomenda_id>/status/', views.atualizar_status_encomenda, name='status'),
]