from django.contrib import admin
from .models import Produto

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ['nome', 'codigo', 'preco_usd', 'preco_mzn', 'preco_zar', 'stock_atual', 'categoria', 'is_active']
    search_fields = ['nome', 'codigo', 'categoria']
    list_filter = ['categoria', 'is_active', 'data_criacao']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('codigo', 'nome', 'descricao', 'categoria')
        }),
        ('Preços', {
            'fields': ('preco_usd', 'preco_mzn', 'preco_zar')
        }),
        ('Stock', {
            'fields': ('stock_atual', 'stock_minimo')
        }),
        ('Outros', {
            'fields': ('imagem_url', 'is_active')
        }),
    )