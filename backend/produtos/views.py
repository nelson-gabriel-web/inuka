from django.shortcuts import get_list_or_404
from django.http import JsonResponse
from .models import Produto

def listar_produtos(request):
    produtos = Produto.objects.filter(is_active=True, stock_atual__gt=0)
    
    categoria = request.GET.get('categoria')
    if categoria:
        produtos = produtos.filter(categoria=categoria)
    
    busca = request.GET.get('busca')
    if busca:
        produtos = produtos.filter(nome__icontains=busca)
    
    dados = []
    for p in produtos:
        # Construir URL da imagem
        imagem_url = None
        if p.imagem:
            # Para Cloudinary
            imagem_url = p.imagem.url if hasattr(p.imagem, 'url') else None
            # Para media local
            if not imagem_url and p.imagem:
                imagem_url = request.build_absolute_uri(p.imagem.url)
        
        dados.append({
            'id': p.id,
            'codigo': p.codigo,
            'nome': p.nome,
            'descricao': p.descricao,
            'preco_usd': float(p.preco_usd) if p.preco_usd else None,
            'preco_zar': float(p.preco_zar),
            'stock_atual': p.stock_atual,
            'categoria': p.categoria,
            'imagem_url': imagem_url  # ← Adicionar URL da imagem
        })
    
    return JsonResponse({'produtos': dados, 'total': len(dados)})

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