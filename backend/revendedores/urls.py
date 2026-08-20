from django.urls import path
from . import views

urlpatterns = [
    path('registar/', views.registar_revendedor, name='registar'),
    path('login/', views.login_revendedor, name='login'),
]