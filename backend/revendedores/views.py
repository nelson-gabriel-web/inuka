from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
from .models import Revendedor
from lojas.models import Loja
import json
import random
import string

def gerar_codigo_unico():
    prefixo = 'RV-2026-'
    codigo = ''.join(random.choices(string.digits, k=4))
    return f"{prefixo}{codigo}"

@csrf_exempt
def registar_revendedor(request):
    if request.method == 'GET':
        return JsonResponse({'mensagem': 'API de registo está funcionando!'})
    
    if request.method == 'POST':
        try:
            if request.content_type and 'application/json' in request.content_type:
                data = json.loads(request.body)
            else:
                data = request.POST
            
            campos_obrigatorios = ['nome_completo', 'email', 'password']
            for campo in campos_obrigatorios:
                if campo not in data or not data[campo]:
                    return JsonResponse({'erro': f'Campo {campo} é obrigatório'}, status=400)
            
            if Revendedor.objects.filter(email=data.get('email')).exists():
                return JsonResponse({'erro': 'Email já registado'}, status=400)
            
            loja = Loja.objects.first()
            if not loja:
                loja = Loja.objects.create(
                    nome='Loja Padrão',
                    provincia='Maputo',
                    cidade='Maputo',
                    endereco='Endereço Padrão',
                    telefone='+258 82 123 4567'
                )
            
            codigo_unico = gerar_codigo_unico()
            
            revendedor = Revendedor.objects.create(
                codigo_unico=codigo_unico,
                nome_completo=data.get('nome_completo'),
                email=data.get('email'),
                telefone='N/A',
                documento_tipo='BI',
                documento_numero='000000000',
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
def login_revendedor(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body) if request.content_type and 'application/json' in request.content_type else request.POST
            
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return JsonResponse({'erro': 'Email e password são obrigatórios'}, status=400)
            
            try:
                revendedor = Revendedor.objects.get(email=email, is_active=True)
                
                from django.contrib.auth.hashers import check_password
                if not check_password(password, revendedor.password_hash):
                    return JsonResponse({'erro': 'Credenciais inválidas'}, status=401)
                
                return JsonResponse({
                    'sucesso': True,
                    'revendedor': {
                        'id': revendedor.id,
                        'nome': revendedor.nome_completo,
                        'email': revendedor.email,
                        'codigo_unico': revendedor.codigo_unico,
                    }
                })
                
            except Revendedor.DoesNotExist:
                return JsonResponse({'erro': 'Revendedor não encontrado'}, status=404)
                
        except Exception as e:
            return JsonResponse({'erro': f'Erro ao processar login: {str(e)}'}, status=500)
    
    return JsonResponse({'erro': 'Método não permitido'}, status=405)