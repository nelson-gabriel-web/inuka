from django.urls import path
from . import views

app_name = 'anuncios'

urlpatterns = [
    path('', views.listar_anuncios, name='listar'),
    path('hero/', views.anuncios_hero, name='hero'),
    path('sidebar/', views.anuncios_sidebar, name='sidebar'),
    path('produtos/', views.anuncios_produtos, name='produtos'),
    path('rodape/', views.anuncios_rodape, name='rodape'),
]