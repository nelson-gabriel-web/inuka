from django.urls import path
from . import views

app_name = 'produtos'

urlpatterns = [
    path('', views.listar_produtos, name='listar'),
    path('categorias/', views.categorias_produtos, name='categorias'),
    path('<int:produto_id>/', views.detalhes_produto, name='detalhes'),
]