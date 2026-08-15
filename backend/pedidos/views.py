from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from decimal import Decimal
from revendedores.models import Revendedor
from produtos.models import Produto
from transacoes.models import Transacao
from .models import Pedido, ItemPedido
import random
import string

def gerar_numero_pedido():
    """Gera um número único para o pedido"""
    ano = timezone.now().year
    mes = timezone.now().month
    dia = timezone.now().day
    prefixo = f"PED-{ano}{mes:02d}{dia:02d}-"
    codigo = ''.join(random.choices(string.digits, k=4))
    return f"{prefixo}{codigo}"

def criar_pedido(request):
    """View para criar um novo pedido"""
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
    revendedor_id = request.POST.get('revendedor_id')
    itens = request.POST.get('itens')  # JSON com lista de produtos e quantidades
    moeda = request.POST.get('moeda', 'USD')
    
    # Verificar revendedor
    try:
        revendedor = Revendedor.objects.get(id=revendedor_id, is_active=True)
    except Revendedor.DoesNotExist:
        return JsonResponse({'erro': 'Revendedor não encontrado'}, status=404)
    
    # Verificar itens
    import json
    try:
        itens_lista = json.loads(itens)
    except json.JSONDecodeError:
        return JsonResponse({'erro': 'Formato de itens inválido'}, status=400)
    
    if not itens_lista:
        return JsonResponse({'erro': 'Carrinho vazio'}, status=400)
    
    # Processar itens e calcular total
    total = Decimal('0')
    itens_pedido = []
    
    for item in itens_lista:
        produto_id = item.get('produto_id')
        quantidade = item.get('quantidade', 1)
        
        try:
            produto = Produto.objects.get(id=produto_id, is_active=True)
        except Produto.DoesNotExist:
            return JsonResponse({'erro': f'Produto {produto_id} não encontrado'}, status=400)
        
        # Verificar stock
        if produto.stock_atual < quantidade:
            return JsonResponse({
                'erro': f'Stock insuficiente para {produto.nome}. Disponível: {produto.stock_atual}'
            }, status=400)
        
        # Calcular preço unitário
        if moeda == 'USD':
            preco_unitario = produto.preco_usd
        elif moeda == 'MZN':
            preco_unitario = produto.preco_mzn or produto.preco_usd
        elif moeda == 'ZAR':
            preco_unitario = produto.preco_zar or produto.preco_usd
        else:
            return JsonResponse({'erro': 'Moeda inválida'}, status=400)
        
        # Validar saldo
        subtotal = preco_unitario * quantidade
        total += subtotal
        
        itens_pedido.append({
            'produto': produto,
            'quantidade': quantidade,
            'preco_unitario': preco_unitario,
            'subtotal': subtotal
        })
    
    # Verificar saldo do revendedor
    # Buscar saldo atual do revendedor na moeda escolhida
    saldo = Decimal('0')
    transacoes = Transacao.objects.filter(revendedor=revendedor, moeda=moeda)
    
    for t in transacoes:
        if t.tipo in ['deposito', 'conversao']:
            saldo += t.valor
        elif t.tipo == 'compra':
            saldo -= t.valor
    
    # Verificar conversões que afetam o saldo na moeda escolhida
    conversoes = Transacao.objects.filter(
        revendedor=revendedor,
        tipo='conversao'
    )
    for c in conversoes:
        if c.moeda == moeda:
            saldo += c.valor
    
    if saldo < total:
        return JsonResponse({
            'erro': 'Saldo insuficiente',
            'saldo_disponivel': float(saldo),
            'total_pedido': float(total),
            'diferenca': float(total - saldo)
        }, status=400)
    
    # Criar pedido
    numero_pedido = gerar_numero_pedido()
    pedido = Pedido.objects.create(
        numero_pedido=numero_pedido,
        revendedor=revendedor,
        loja_recolha=revendedor.loja_recolha,
        valor_total=total,
        moeda=moeda,
        status='aguardando_separacao'
    )
    
    # Criar itens do pedido
    for item in itens_pedido:
        ItemPedido.objects.create(
            pedido=pedido,
            produto=item['produto'],
            quantidade=item['quantidade'],
            preco_unitario=item['preco_unitario'],
            subtotal=item['subtotal']
        )
        
        # Atualizar stock
        produto = item['produto']
        produto.stock_atual -= item['quantidade']
        produto.save()
    
    # Registrar transação de compra
    Transacao.objects.create(
        revendedor=revendedor,
        tipo='compra',
        valor=total,
        moeda=moeda,
        saldo_anterior=saldo,
        saldo_novo=saldo - total,
        referencia_id=pedido.id
    )
    
    return JsonResponse({
        'sucesso': True,
        'pedido': {
            'numero_pedido': pedido.numero_pedido,
            'valor_total': float(pedido.valor_total),
            'moeda': pedido.moeda,
            'status': pedido.status,
            'loja_recolha': pedido.loja_recolha.nome if pedido.loja_recolha else None,
            'data_pedido': pedido.data_pedido,
            'itens': [
                {
                    'produto': item.produto.nome,
                    'quantidade': item.quantidade,
                    'preco_unitario': float(item.preco_unitario),
                    'subtotal': float(item.subtotal)
                }
                for item in ItemPedido.objects.filter(pedido=pedido)
            ]
        }
    })

def rastrear_pedido(request, pedido_id):
    """View para rastrear um pedido"""
    pedido = get_object_or_404(Pedido, id=pedido_id)
    
    # Linha do tempo do pedido
    timeline = []
    
    status_map = {
        'aguardando_separacao': 'Aguardando Separação',
        'em_separacao': 'Em Separação',
        'embalado': 'Embalado',
        'em_transporte': 'Em Trânsito',
        'chegou_loja': 'Chegou à Loja',
        'entregue': 'Entregue',
        'cancelado': 'Cancelado'
    }
    
    datas = [
        ('aguardando_separacao', pedido.data_pedido),
        ('em_separacao', pedido.data_separacao),
        ('embalado', pedido.data_embalagem),
        ('em_transporte', pedido.data_transporte),
        ('chegou_loja', pedido.data_chegada_loja),
        ('entregue', pedido.data_levantamento),
    ]
    
    for status_key, data in datas:
        if data:
            timeline.append({
                'status': status_key,
                'status_label': status_map.get(status_key, status_key),
                'data': data,
                'ativo': True if status_key == pedido.status else (
                    pedido.status in ['entregue', 'cancelado'] if True else False
                )
            })
    
    return JsonResponse({
        'pedido': {
            'numero_pedido': pedido.numero_pedido,
            'status': pedido.status,
            'status_label': status_map.get(pedido.status, pedido.status),
            'valor_total': float(pedido.valor_total),
            'moeda': pedido.moeda,
            'loja_recolha': pedido.loja_recolha.nome if pedido.loja_recolha else None,
            'data_pedido': pedido.data_pedido,
            'timeline': timeline,
            'itens': [
                {
                    'produto': item.produto.nome,
                    'quantidade': item.quantidade,
                    'preco_unitario': float(item.preco_unitario),
                    'subtotal': float(item.subtotal)
                }
                for item in ItemPedido.objects.filter(pedido=pedido)
            ]
        }
    })

def listar_pedidos_revendedor(request, revendedor_id):
    """View para listar pedidos de um revendedor"""
    revendedor = get_object_or_404(Revendedor, id=revendedor_id)
    pedidos = Pedido.objects.filter(revendedor=revendedor).order_by('-data_pedido')
    
    dados = []
    for pedido in pedidos:
        dados.append({
            'numero_pedido': pedido.numero_pedido,
            'valor_total': float(pedido.valor_total),
            'moeda': pedido.moeda,
            'status': pedido.status,
            'data_pedido': pedido.data_pedido,
            'loja_recolha': pedido.loja_recolha.nome if pedido.loja_recolha else None
        })
    
    return JsonResponse({
        'revendedor': revendedor.nome_completo,
        'pedidos': dados,
        'total': len(dados)
    })

def atualizar_status_pedido(request, pedido_id):
    """View para atualizar status do pedido (admin)"""
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
    pedido = get_object_or_404(Pedido, id=pedido_id)
    novo_status = request.POST.get('status')
    
    if novo_status not in dict(Pedido.STATUS):
        return JsonResponse({'erro': 'Status inválido'}, status=400)
    
    pedido.update_status(novo_status)
    
    # Verificar se é para notificar revendedor
    notificar = request.POST.get('notificar', 'false') == 'true'
    
    return JsonResponse({
        'sucesso': True,
        'pedido': pedido.numero_pedido,
        'novo_status': pedido.status,
        'data_atualizacao': timezone.now()
    })