from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from revendedores.models import Revendedor
from clientes.models import Cliente
from produtos.models import Produto
from .models import Encomenda, ItemEncomenda
import json
from decimal import Decimal

@csrf_exempt
def listar_encomendas(request, revendedor_id):
    """Lista todas as encomendas de um revendedor"""
    try:
        revendedor = Revendedor.objects.get(id=revendedor_id, is_active=True)
        encomendas = Encomenda.objects.filter(revendedor=revendedor)
        
        dados = []
        for e in encomendas:
            dados.append({
                'id': e.id,
                'cliente': e.cliente.nome,
                'cliente_id': e.cliente.id,
                'valor_total': float(e.valor_total),
                'comissao_total': float(e.comissao_total),
                'status': e.status,
                'data_criacao': e.data_criacao,
                'itens': [
                    {
                        'produto': item.produto.nome,
                        'quantidade': item.quantidade,
                        'preco_unitario': float(item.preco_unitario),
                        'subtotal': float(item.subtotal),
                        'comissao_item': float(item.comissao_item),
                    }
                    for item in e.itens.all()
                ]
            })
        
        return JsonResponse({'encomendas': dados, 'total': len(dados)})
    except Revendedor.DoesNotExist:
        return JsonResponse({'erro': 'Revendedor não encontrado'}, status=404)

@csrf_exempt
def criar_encomenda(request):
    """Cria uma nova encomenda"""
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        revendedor = Revendedor.objects.get(id=data.get('revendedor_id'), is_active=True)
        cliente = Cliente.objects.get(id=data.get('cliente_id'), is_active=True)
        
        # Criar encomenda
        encomenda = Encomenda.objects.create(
            revendedor=revendedor,
            cliente=cliente,
            observacao=data.get('observacao', '')
        )
        
        # Adicionar itens
        for item_data in data.get('itens', []):
            produto = Produto.objects.get(id=item_data['produto_id'])
            
            ItemEncomenda.objects.create(
                encomenda=encomenda,
                produto=produto,
                quantidade=item_data['quantidade'],
                preco_unitario=produto.preco_zar,
            )
        
        # Recalcular totais
        encomenda.calcular_totais()
        
        return JsonResponse({
            'sucesso': True,
            'mensagem': 'Encomenda criada com sucesso!',
            'encomenda': {
                'id': encomenda.id,
                'cliente': encomenda.cliente.nome,
                'valor_total': float(encomenda.valor_total),
                'comissao_total': float(encomenda.comissao_total),
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({'erro': str(e)}, status=400)

@csrf_exempt
def detalhes_encomenda(request, encomenda_id):
    """Obtém detalhes de uma encomenda"""
    encomenda = get_object_or_404(Encomenda, id=encomenda_id)
    
    return JsonResponse({
        'id': encomenda.id,
        'cliente': encomenda.cliente.nome,
        'cliente_id': encomenda.cliente.id,
        'valor_total': float(encomenda.valor_total),
        'comissao_total': float(encomenda.comissao_total),
        'status': encomenda.status,
        'data_criacao': encomenda.data_criacao,
        'itens': [
            {
                'produto': item.produto.nome,
                'produto_id': item.produto.id,
                'quantidade': item.quantidade,
                'preco_unitario': float(item.preco_unitario),
                'subtotal': float(item.subtotal),
                'comissao_item': float(item.comissao_item),
            }
            for item in encomenda.itens.all()
        ]
    })

@csrf_exempt
def atualizar_status_encomenda(request, encomenda_id):
    """Atualiza o status de uma encomenda"""
    if request.method != 'PUT':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
    try:
        data = json.loads(request.body)
        encomenda = get_object_or_404(Encomenda, id=encomenda_id)
        
        novo_status = data.get('status')
        if novo_status not in dict(Encomenda.STATUS):
            return JsonResponse({'erro': 'Status inválido'}, status=400)
        
        encomenda.status = novo_status
        encomenda.save()
        
        # Se for pago, atualizar saldo devedor do cliente
        if novo_status == 'paga':
            cliente = encomenda.cliente
            cliente.saldo_devedor += encomenda.valor_total
            cliente.save()
        
        return JsonResponse({
            'sucesso': True,
            'mensagem': f'Status atualizado para {novo_status}',
        })
    except Exception as e:
        return JsonResponse({'erro': str(e)}, status=400)