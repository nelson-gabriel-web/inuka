from django.contrib import admin
from .models import Produto

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nome', 'preco_zar', 'stock_atual', 'categoria', 'is_active']
    search_fields = ['nome', 'codigo']
    list_filter = ['categoria', 'is_active']
    
    # Adicionar suporte para upload de imagem
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
        ('Imagem', {
            'fields': ('imagem',)  # ← Campo para upload
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )