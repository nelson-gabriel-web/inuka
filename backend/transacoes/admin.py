from django.contrib import admin
from .models import Deposito, Conversao, Transacao, TaxaCambio, Notificacao

@admin.register(Deposito)
class DepositoAdmin(admin.ModelAdmin):
    list_display = ['revendedor', 'valor', 'moeda', 'metodo', 'status', 'data_deposito']
    search_fields = ['revendedor__nome_completo', 'referencia_externa']
    list_filter = ['metodo', 'moeda', 'status', 'data_deposito']

@admin.register(Conversao)
class ConversaoAdmin(admin.ModelAdmin):
    list_display = ['revendedor', 'valor_origem', 'moeda_origem', 'valor_destino', 'moeda_destino', 'data_conversao']
    search_fields = ['revendedor__nome_completo']
    list_filter = ['moeda_origem', 'moeda_destino']
    readonly_fields = ['data_conversao']

@admin.register(Transacao)
class TransacaoAdmin(admin.ModelAdmin):
    list_display = ['revendedor', 'tipo', 'valor', 'moeda', 'data_transacao']
    search_fields = ['revendedor__nome_completo']
    list_filter = ['tipo', 'moeda', 'data_transacao']
    readonly_fields = ['data_transacao']

@admin.register(TaxaCambio)
class TaxaCambioAdmin(admin.ModelAdmin):
    list_display = ['moeda_origem', 'moeda_destino', 'taxa_compra', 'taxa_venda', 'data_atualizacao']
    list_filter = ['moeda_origem', 'moeda_destino']
    readonly_fields = ['data_atualizacao']
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        # Filtrar apenas combinações relevantes com ZAR
        return queryset.filter(
            moeda_origem__in=['USD', 'MZN', 'ZAR'],
            moeda_destino__in=['USD', 'MZN', 'ZAR']
        )

@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ['revendedor', 'titulo', 'tipo', 'lida', 'data_envio']
    search_fields = ['revendedor__nome_completo', 'titulo']
    list_filter = ['tipo', 'lida', 'data_envio']