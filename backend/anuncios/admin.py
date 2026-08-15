from django.contrib import admin
from .models import Anuncio

@admin.register(Anuncio)
class AnuncioAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'posicao', 'is_active', 'data_inicio', 'data_fim']
    list_filter = ['posicao', 'is_active']
    search_fields = ['titulo', 'descricao']
    ordering = ['posicao', 'ordem']
    
    fieldsets = (
        ('Informações do Anúncio', {
            'fields': ('titulo', 'descricao', 'imagem_url', 'link')
        }),
        ('Posicionamento', {
            'fields': ('posicao', 'ordem')
        }),
        ('Período', {
            'fields': ('is_active', 'data_inicio', 'data_fim')
        }),
    )