from django.urls import path
from . import views

app_name = 'revendedores'

urlpatterns = [
    path('registar/', views.registar_revendedor, name='registar'),
    path('login/', views.login_revendedor, name='login'),
    path('perfil/<int:revendedor_id>/', views.perfil_revendedor, name='perfil'),
]