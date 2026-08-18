from django.contrib import admin
from .models import Produto

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nome', 'preco_zar', 'stock_atual', 'categoria', 'is_active']
    search_fields = ['nome', 'codigo']
    list_filter = ['categoria', 'is_active']
