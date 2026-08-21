from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .models import Revendedor
from lojas.models import Loja
import random
import string
import json

def gerar_codigo_unico():
    prefixo = 'RV-2026-'
    codigo = ''.join(random.choices(string.digits, k=4))
    return f"{prefixo}{codigo}"

@csrf_exempt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def registar_revendedor(request):
    if request.method == 'GET':
        return JsonResponse({'mensagem': 'API de registo está funcionando!'})
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            return JsonResponse({
                'sucesso': True,
                'mensagem': 'Revendedor registado!',
                'dados': data
            })
        except Exception as e:
            return JsonResponse({'erro': str(e)}, status=400)
    
    return JsonResponse({'erro': 'Método não permitido'}, status=405)

@csrf_exempt
def login_revendedor(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            return JsonResponse({
                'sucesso': True,
                'mensagem': 'Login bem-sucedido!',
                'dados': data
            })
        except Exception as e:
            return JsonResponse({'erro': str(e)}, status=400)
    
    return JsonResponse({'erro': 'Método não permitido'}, status=405)
            
            # Buscar ou criar uma loja
            loja = Loja.objects.first()
            if not loja:
                loja = Loja.objects.create(
                    nome='Loja Padrão',
                    provincia='Maputo',
                    cidade='Maputo',
                    endereco='Endereço Padrão',
                    telefone='+258 82 123 4567'
                )
            
            # Gerar código único
            codigo_unico = gerar_codigo_unico()
            
            # Criar revendedor
            revendedor = Revendedor.objects.create(
                codigo_unico=codigo_unico,
                nome_completo=data.get('nome_completo'),
                email=data.get('email'),
                telefone=data.get('telefone', 'N/A'),
                documento_tipo='BI',
                documento_numero=data.get('documento_numero', '000000000'),
                provincia='N/A',
                cidade='N/A',
                bairro='',
                password_hash=make_password(data.get('password')),
                loja_recolha=loja,
                is_active=True
            )
            
            return JsonResponse({
                'sucesso': True,
                'mensagem': 'Revendedor registado com sucesso!',
                'codigo_unico': codigo_unico,
                'revendedor': {
                    'id': revendedor.id,
                    'nome': revendedor.nome_completo,
                    'email': revendedor.email,
                }
            }, status=201)
            
        except Exception as e:
            return JsonResponse({'erro': f'Erro ao processar: {str(e)}'}, status=500)
    
    return JsonResponse({'erro': 'Método não permitido'}, status=405)

@csrf_exempt
@csrf_exempt
def login_revendedor(request):
    """View para login do revendedor (SEM código único)"""
    if request.method == 'POST':
        try:
            if request.content_type and 'application/json' in request.content_type:
                data = json.loads(request.body)
            else:
                data = request.POST
            
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return JsonResponse({'erro': 'Email e password são obrigatórios'}, status=400)
            
            try:
                revendedor = Revendedor.objects.get(email=email, is_active=True)
                
                if not check_password(password, revendedor.password_hash):
                    return JsonResponse({'erro': 'Credenciais inválidas'}, status=401)
                
                revendedor.data_ultimo_login = timezone.now()
                revendedor.save()
                
                return JsonResponse({
                    'sucesso': True,
                    'revendedor': {
                        'id': revendedor.id,
                        'nome_completo': revendedor.nome_completo,
                        'email': revendedor.email,
                        'telefone': revendedor.telefone,
                        'codigo_unico': revendedor.codigo_unico,
                        'provincia': revendedor.provincia,
                        'cidade': revendedor.cidade,
                        'bairro': revendedor.bairro,
                        'loja_recolha': revendedor.loja_recolha.nome if revendedor.loja_recolha else None,
                        'documento_tipo': revendedor.documento_tipo,
                        'documento_numero': revendedor.documento_numero,
                        'data_registo': revendedor.data_registo,
                        'ultimo_login': revendedor.data_ultimo_login
                    }
                })
                
            except Revendedor.DoesNotExist:
                return JsonResponse({'erro': 'Revendedor não encontrado'}, status=404)
                
        except Exception as e:
            return JsonResponse({'erro': f'Erro ao processar login: {str(e)}'}, status=500)
    
    return JsonResponse({'erro': 'Método não permitido'}, status=405)


def perfil_revendedor(request, revendedor_id):
    """View para ver perfil do revendedor"""
    try:
        revendedor = Revendedor.objects.get(id=revendedor_id, is_active=True)
        return JsonResponse({
            'id': revendedor.id,
            'nome': revendedor.nome_completo,
            'email': revendedor.email,
            'telefone': revendedor.telefone,
            'codigo_unico': revendedor.codigo_unico,
            'provincia': revendedor.provincia,
            'cidade': revendedor.cidade,
            'loja_recolha': revendedor.loja_recolha.nome if revendedor.loja_recolha else None,
            'data_registo': revendedor.data_registo,
            'ultimo_login': revendedor.data_ultimo_login
        })
    except Revendedor.DoesNotExist:
        return JsonResponse({'erro': 'Revendedor não encontrado'}, status=404)