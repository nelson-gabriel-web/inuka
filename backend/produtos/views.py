from django.shortcuts import get_list_or_404
from django.http import JsonResponse
from .models import Produto

def listar_produtos(request):
    """View para listar produtos disponíveis"""
    produtos = Produto.objects.filter(is_active=True, stock_atual__gt=0)
    
    # Parâmetros de filtro
    categoria = request.GET.get('categoria')
    if categoria:
        produtos = produtos.filter(categoria=categoria)
    
    # Parâmetro de busca
    busca = request.GET.get('busca')
    if busca:
        produtos = produtos.filter(nome__icontains=busca)
    
    # Converter para JSON
    dados = []
    for produto in produtos:
        dados.append({
            'id': produto.id,
            'codigo': produto.codigo,
            'nome': produto.nome,
            'descricao': produto.descricao,
            'preco_usd': float(produto.preco_usd),
            'preco_mzn': float(produto.preco_mzn) if produto.preco_mzn else None,
            'preco_zar': float(produto.preco_zar) if produto.preco_zar else None,
            'stock_atual': produto.stock_atual,
            'categoria': produto.categoria,
            'imagem_url': produto.imagem_url
        })
    
    return JsonResponse({
        'produtos': dados,
        'total': len(dados)
    })

def detalhes_produto(request, produto_id):
    """View para detalhes de um produto específico"""
    produto = get_object_or_404(Produto, id=produto_id, is_active=True)
    
    return JsonResponse({
        'id': produto.id,
        'codigo': produto.codigo,
        'nome': produto.nome,
        'descricao': produto.descricao,
        'preco_usd': float(produto.preco_usd),
        'preco_mzn': float(produto.preco_mzn) if produto.preco_mzn else None,
        'preco_zar': float(produto.preco_zar) if produto.preco_zar else None,
        'stock_atual': produto.stock_atual,
        'categoria': produto.categoria,
        'imagem_url': produto.imagem_url
    })

def categorias_produtos(request):
    """View para listar categorias disponíveis (sem repetições)"""
    categorias = Produto.objects.filter(is_active=True).values_list('categoria', flat=True).distinct()
    categorias = [c for c in categorias if c]  # Remover None/empty
    return JsonResponse({
        'categorias': categorias
    })