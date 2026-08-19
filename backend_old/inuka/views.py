from django.http import JsonResponse
from django.shortcuts import render

def home(request):
    """Página inicial da plataforma INUKA"""
    return JsonResponse({
        'mensagem': 'Bem-vindo à Plataforma INUKA!',
        'versao': '1.0.0',
        'endpoints_disponiveis': {
            'revendedores': {
                'registar': '/api/revendedores/registar/',
                'login': '/api/revendedores/login/',
                'perfil': '/api/revendedores/perfil/<int:revendedor_id>/',
            },
            'produtos': {
                'listar': '/api/produtos/',
                'categorias': '/api/produtos/categorias/',
                'detalhes': '/api/produtos/<int:produto_id>/',
            },
            'pedidos': {
                'criar': '/api/pedidos/criar/',
                'rastrear': '/api/pedidos/<int:pedido_id>/',
                'listar': '/api/pedidos/revendedor/<int:revendedor_id>/',
                'atualizar_status': '/api/pedidos/<int:pedido_id>/atualizar-status/',
            },
            'transacoes': {
                'saldo': '/api/transacoes/saldo/<int:revendedor_id>/',
                'depositar': '/api/transacoes/depositar/',
                'confirmar_deposito': '/api/transacoes/confirmar-deposito/<int:deposito_id>/',
                'converter': '/api/transacoes/converter/',
                'taxas': '/api/transacoes/taxas/',
            },
            'admin': '/admin/',
        }
    })