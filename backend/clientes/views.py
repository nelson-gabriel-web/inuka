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
                'saldo_devedor': float(c.saldo_devedor),
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
        'saldo_devedor': float(cliente.saldo_devedor),
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