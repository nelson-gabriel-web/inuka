from django.contrib import admin
from .models import Loja

@admin.register(Loja)
class LojaAdmin(admin.ModelAdmin):
    list_display = ['nome', 'provincia', 'cidade', 'is_active']
    search_fields = ['nome', 'provincia', 'cidade']
    list_filter = ['provincia', 'is_active']