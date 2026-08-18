from django.shortcuts import get_object_or_404
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
            try:
                imagem_url = p.imagem.url
            except:
                imagem_url = None
        
        dados.append({
            'id': p.id,
            'codigo': p.codigo,
            'nome': p.nome,
            'descricao': p.descricao,
            'preco_usd': float(p.preco_usd) if p.preco_usd else None,
            'preco_zar': float(p.preco_zar),
            'comissao_percentual': float(p.comissao_percentual),
            'stock_atual': p.stock_atual,
            'categoria': p.categoria,
            'imagem_url': imagem_url
        })
    
    return JsonResponse({'produtos': dados, 'total': len(dados)})

def categorias_produtos(request):
    categorias = Produto.objects.filter(is_active=True).values_list('categoria', flat=True).distinct()
    categorias = [c for c in categorias if c]
    return JsonResponse({'categorias': categorias})

def detalhes_produto(request, produto_id):
    produto = get_object_or_404(Produto, id=produto_id, is_active=True)
    
    imagem_url = None
    if produto.imagem:
        try:
            imagem_url = produto.imagem.url
        except:
            imagem_url = None
    
    return JsonResponse({
        'id': produto.id,
        'codigo': produto.codigo,
        'nome': produto.nome,
        'descricao': produto.descricao,
        'preco_zar': float(produto.preco_zar),
        'comissao_percentual': float(produto.comissao_percentual),
        'stock_atual': produto.stock_atual,
        'categoria': produto.categoria,
        'imagem_url': imagem_url
    })