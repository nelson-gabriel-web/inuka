from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from revendedores.models import Revendedor
from .models import Cliente
import json

@csrf_exempt
def listar_clientes(request, revendedor_id):
    """Lista todos os clientes de um revendedor"""
    try:
        revendedor = Revendedor.objects.get(id=revendedor_id, is_active=True)
        clientes = Cliente.objects.filter(revendedor=revendedor, is_active=True)
        
        dados = []
        for c in clientes:
            dados.append({
                'id': c.id,
                'nome': c.nome,
                'telefone': c.telefone,
                'email': c.email,
                'endereco': c.endereco,
                'saldo_devedor_mzn': float(c.saldo_devedor_mzn),
                'data_criacao': c.data_criacao,
            })
        
        return JsonResponse({'clientes': dados, 'total': len(dados)})
    except Revendedor.DoesNotExist:
        return JsonResponse({'erro': 'Revendedor não encontrado'}, status=404)

@csrf_exempt
def criar_cliente(request):
    """Cria um novo cliente para o revendedor"""
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
    try:
        data = json.loads(request.body)
        revendedor = Revendedor.objects.get(id=data.get('revendedor_id'), is_active=True)
        
        cliente = Cliente.objects.create(
            revendedor=revendedor,
            nome=data.get('nome'),
            telefone=data.get('telefone'),
            email=data.get('email', ''),
            endereco=data.get('endereco', ''),
        )
        
        return JsonResponse({
            'sucesso': True,
            'mensagem': 'Cliente criado com sucesso!',
            'cliente': {
                'id': cliente.id,
                'nome': cliente.nome,
                'telefone': cliente.telefone,
                'email': cliente.email,
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({'erro': str(e)}, status=400)

@csrf_exempt
def detalhes_cliente(request, cliente_id):
    """Obtém detalhes de um cliente"""
    cliente = get_object_or_404(Cliente, id=cliente_id, is_active=True)
    
    return JsonResponse({
        'id': cliente.id,
        'nome': cliente.nome,
        'telefone': cliente.telefone,
        'email': cliente.email,
        'endereco': cliente.endereco,
        'saldo_devedor_mzn': float(cliente.saldo_devedor_mzn),
        'data_criacao': cliente.data_criacao,
    })

@csrf_exempt
def atualizar_cliente(request, cliente_id):
    """Atualiza os dados de um cliente"""
    if request.method != 'PUT':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
    try:
        data = json.loads(request.body)
        cliente = get_object_or_404(Cliente, id=cliente_id, is_active=True)
        
        if 'nome' in data:
            cliente.nome = data['nome']
        if 'telefone' in data:
            cliente.telefone = data['telefone']
        if 'email' in data:
            cliente.email = data['email']
        if 'endereco' in data:
            cliente.endereco = data['endereco']
        
        cliente.save()
        
        return JsonResponse({
            'sucesso': True,
            'mensagem': 'Cliente atualizado com sucesso!',
        })
    except Exception as e:
        return JsonResponse({'erro': str(e)}, status=400)

from rest_framework import viewsets
from .serializers import ClienteSerializer
from .models import Cliente

class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    
    def get_queryset(self):
        revendedor_id = self.request.query_params.get('revendedor_id')
        if revendedor_id:
            return Cliente.objects.filter(revendedor_id=revendedor_id, is_active=True)
        return Cliente.objects.filter(is_active=True)

@csrf_exempt
def registar_pagamento(request):
    """Regista um pagamento de um cliente"""
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
    try:
        if request.content_type and 'application/json' in request.content_type:
            data = json.loads(request.body)
        else:
            data = request.POST
        
        encomenda_id = data.get('encomenda_id')
        valor = data.get('valor')
        metodo = data.get('metodo', 'dinheiro')
        observacao = data.get('observacao', '')
        
        # Validar
        if not encomenda_id or not valor:
            return JsonResponse({'erro': 'Encomenda e valor são obrigatórios'}, status=400)
        
        try:
            encomenda = Encomenda.objects.get(id=encomenda_id)
            cliente = encomenda.cliente
            valor_decimal = Decimal(valor)
        except Encomenda.DoesNotExist:
            return JsonResponse({'erro': 'Encomenda não encontrada'}, status=404)
        except ValueError:
            return JsonResponse({'erro': 'Valor inválido'}, status=400)
        
        # Verificar se o valor não excede o saldo devedor
        if valor_decimal > cliente.saldo_devedor_mzn:
            return JsonResponse({
                'erro': f'Valor excede o saldo devedor. Saldo atual: {cliente.saldo_devedor_mzn:.2f} MZN'
            }, status=400)
        
        # Criar pagamento
        pagamento = Pagamento.objects.create(
            cliente=cliente,
            encomenda=encomenda,
            valor=valor_decimal,
            metodo=metodo,
            observacao=observacao
        )
        
        # Atualizar saldo devedor do cliente
        cliente.saldo_devedor_mzn -= valor_decimal
        cliente.save()
        
        # Atualizar status da encomenda para "paga"
        if encomenda.status == 'pendente':
            encomenda.status = 'paga'
            encomenda.save()
        
        return JsonResponse({
            'sucesso': True,
            'mensagem': f'Pagamento de {valor_decimal:.2f} MZN registado com sucesso!',
            'pagamento': {
                'id': pagamento.id,
                'cliente': cliente.nome,
                'encomenda': encomenda.id,
                'valor': float(valor_decimal),
                'metodo': metodo,
                'data': pagamento.data_pagamento
            },
            'saldo_restante': float(cliente.saldo_devedor_mzn)
        }, status=201)
        
    except Exception as e:
        return JsonResponse({'erro': f'Erro ao registar pagamento: {str(e)}'}, status=500)