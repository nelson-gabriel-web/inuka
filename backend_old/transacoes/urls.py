from django.urls import path
from . import views

app_name = 'transacoes'

urlpatterns = [
    path('saldo/<int:revendedor_id>/', views.saldo_revendedor, name='saldo'),
    path('depositar/', views.depositar, name='depositar'),
    path('confirmar-deposito/<int:deposito_id>/', views.confirmar_deposito, name='confirmar_deposito'),
    path('converter/', views.converter_moeda, name='converter'),
    path('taxas/', views.taxas_cambio_disponiveis, name='taxas'),
]