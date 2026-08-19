from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from decimal import Decimal
from revendedores.models import Revendedor
from .models import Deposito, Conversao, Transacao, TaxaCambio

def saldo_revendedor(request, revendedor_id):
    """View para ver saldo do revendedor"""
    revendedor = get_object_or_404(Revendedor, id=revendedor_id)
    
    # Calcular saldo por moeda
    depositos = Deposito.objects.filter(revendedor=revendedor, status='confirmado')
    compras = Transacao.objects.filter(revendedor=revendedor, tipo='compra')
    
    saldo_mzn = Decimal('0')
    saldo_usd = Decimal('0')
    saldo_zar = Decimal('0')
    
    # Somar depósitos
    for deposito in depositos:
        if deposito.moeda == 'MZN':
            saldo_mzn += deposito.valor
        elif deposito.moeda == 'USD':
            saldo_usd += deposito.valor
        elif deposito.moeda == 'ZAR':
            saldo_zar += deposito.valor
    
    # Subtrair compras
    for compra in compras:
        if compra.moeda == 'MZN':
            saldo_mzn -= compra.valor
        elif compra.moeda == 'USD':
            saldo_usd -= compra.valor
        elif compra.moeda == 'ZAR':
            saldo_zar -= compra.valor
    
    # Considerar conversões
    conversoes = Conversao.objects.filter(revendedor=revendedor)
    for conv in conversoes:
        if conv.moeda_origem == 'MZN':
            saldo_mzn -= conv.valor_origem
            if conv.moeda_destino == 'USD':
                saldo_usd += conv.valor_destino
            elif conv.moeda_destino == 'ZAR':
                saldo_zar += conv.valor_destino
        elif conv.moeda_origem == 'USD':
            saldo_usd -= conv.valor_origem
            if conv.moeda_destino == 'MZN':
                saldo_mzn += conv.valor_destino
            elif conv.moeda_destino == 'ZAR':
                saldo_zar += conv.valor_destino
        elif conv.moeda_origem == 'ZAR':
            saldo_zar -= conv.valor_origem
            if conv.moeda_destino == 'MZN':
                saldo_mzn += conv.valor_destino
            elif conv.moeda_destino == 'USD':
                saldo_usd += conv.valor_destino
    
    return JsonResponse({
        'revendedor_id': revendedor.id,
        'saldo': {
            'MZN': float(saldo_mzn),
            'USD': float(saldo_usd),
            'ZAR': float(saldo_zar)
        }
    })

def depositar(request):
    """View para processar depósito"""
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
    revendedor_id = request.POST.get('revendedor_id')
    metodo = request.POST.get('metodo')
    valor = request.POST.get('valor')
    moeda = request.POST.get('moeda')
    referencia = request.POST.get('referencia')
    
    try:
        revendedor = Revendedor.objects.get(id=revendedor_id, is_active=True)
        valor_decimal = Decimal(valor)
    except (Revendedor.DoesNotExist, ValueError):
        return JsonResponse({'erro': 'Dados inválidos'}, status=400)
    
    # Criar depósito
    deposito = Deposito.objects.create(
        revendedor=revendedor,
        metodo=metodo,
        valor=valor_decimal,
        moeda=moeda,
        referencia_externa=referencia,
        status='pendente'
    )
    
    # Registrar transação (pendente)
    transacao = Transacao.objects.create(
        revendedor=revendedor,
        tipo='deposito',
        valor=valor_decimal,
        moeda=moeda,
        saldo_anterior=0,  # Será atualizado após confirmação
        saldo_novo=0,      # Será atualizado após confirmação
        referencia_id=deposito.id
    )
    
    return JsonResponse({
        'sucesso': True,
        'mensagem': 'Depósito registado. Aguarde confirmação.',
        'deposito_id': deposito.id,
        'status': 'pendente'
    })

def confirmar_deposito(request, deposito_id):
    """View para confirmar depósito (admin)"""
    deposito = get_object_or_404(Deposito, id=deposito_id)
    
    if deposito.status == 'confirmado':
        return JsonResponse({'erro': 'Depósito já confirmado'}, status=400)
    
    # Confirmar depósito
    deposito.confirmar()
    
    # Atualizar transação
    transacao = Transacao.objects.get(referencia_id=deposito.id, tipo='deposito')
    
    # Calcular saldo atual
    saldo_atual = Decimal('0')
    transacoes_anteriores = Transacao.objects.filter(
        revendedor=deposito.revendedor,
        moeda=deposito.moeda,
        data_transacao__lt=transacao.data_transacao
    )
    for t in transacoes_anteriores:
        if t.tipo in ['deposito', 'conversao']:
            saldo_atual += t.valor
        elif t.tipo == 'compra':
            saldo_atual -= t.valor
    
    # Atualizar transação com saldos corretos
    transacao.saldo_anterior = saldo_atual
    transacao.saldo_novo = saldo_atual + deposito.valor
    transacao.save()
    
    return JsonResponse({
        'sucesso': True,
        'mensagem': 'Depósito confirmado com sucesso!',
        'novo_saldo': float(transacao.saldo_novo)
    })

def converter_moeda(request):
    """View para converter moedas"""
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
    revendedor_id = request.POST.get('revendedor_id')
    moeda_origem = request.POST.get('moeda_origem')
    moeda_destino = request.POST.get('moeda_destino')
    valor_origem = request.POST.get('valor_origem')
    
    try:
        revendedor = Revendedor.objects.get(id=revendedor_id, is_active=True)
        valor_origem_decimal = Decimal(valor_origem)
    except (Revendedor.DoesNotExist, ValueError):
        return JsonResponse({'erro': 'Dados inválidos'}, status=400)
    
    # Obter taxa de câmbio do dia
    try:
        taxa = TaxaCambio.objects.filter(
            moeda_origem=moeda_origem,
            moeda_destino=moeda_destino
        ).latest('data_atualizacao')
        
        taxa_venda = taxa.taxa_venda
    except TaxaCambio.DoesNotExist:
        return JsonResponse({'erro': 'Taxa de câmbio não disponível'}, status=400)
    
    # Calcular valor de destino
    valor_destino = valor_origem_decimal * taxa_venda
    
    # Registrar conversão
    conversao = Conversao.objects.create(
        revendedor=revendedor,
        valor_origem=valor_origem_decimal,
        moeda_origem=moeda_origem,
        valor_destino=valor_destino,
        moeda_destino=moeda_destino,
        taxa_cambio=taxa_venda
    )
    
    # Registrar transação
    transacao = Transacao.objects.create(
        revendedor=revendedor,
        tipo='conversao',
        valor=valor_origem_decimal,
        moeda=moeda_origem,
        saldo_anterior=0,  # Será calculado
        saldo_novo=0,      # Será calculado
        referencia_id=conversao.id
    )
    
    return JsonResponse({
        'sucesso': True,
        'conversao': {
            'valor_origem': float(valor_origem_decimal),
            'moeda_origem': moeda_origem,
            'valor_destino': float(valor_destino),
            'moeda_destino': moeda_destino,
            'taxa_cambio': float(taxa_venda)
        }
    })

def taxas_cambio_disponiveis(request):
    """View para listar taxas de câmbio disponíveis"""
    taxas = TaxaCambio.objects.all().order_by('moeda_origem', 'moeda_destino')
    
    dados = []
    for taxa in taxas:
        dados.append({
            'moeda_origem': taxa.moeda_origem,
            'moeda_destino': taxa.moeda_destino,
            'taxa_compra': float(taxa.taxa_compra),
            'taxa_venda': float(taxa.taxa_venda),
            'data_atualizacao': taxa.data_atualizacao,
            'fonte': taxa.fonte
        })
    
    return JsonResponse({
        'taxas': dados
    })