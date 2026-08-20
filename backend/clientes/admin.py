from django.contrib import admin
from .models import Cliente, Pagamento

@admin.register(Pagamento)
class PagamentoAdmin(admin.ModelAdmin):
    list_display = ['cliente', 'encomenda', 'valor', 'metodo', 'data_pagamento']
    list_filter = ['metodo', 'data_pagamento']
    search_fields = ['cliente__nome', 'encomenda__id']
