from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Anuncio
from django.utils import timezone
from django.db import models

def listar_anuncios(request, posicao=None):
    """Lista anúncios ativos por posição"""
    anuncios = Anuncio.objects.filter(
        is_active=True,
        data_inicio__lte=timezone.now()
    ).filter(
        models.Q(data_fim__isnull=True) | models.Q(data_fim__gte=timezone.now())
    )
    
    if posicao:
        anuncios = anuncios.filter(posicao=posicao)
    
    anuncios = anuncios.order_by('ordem')
    
    dados = []
    for anuncio in anuncios:
        dados.append({
            'id': anuncio.id,
            'titulo': anuncio.titulo,
            'descricao': anuncio.descricao,
            'imagem_url': anuncio.imagem_url,
            'link': anuncio.link,
            'posicao': anuncio.posicao,
        })
    
    return JsonResponse({
        'anuncios': dados,
        'total': len(dados)
    })

def anuncios_hero(request):
    """Retorna anúncios para a posição Hero"""
    return listar_anuncios(request, 'hero')

def anuncios_sidebar(request):
    """Retorna anúncios para a posição Sidebar"""
    return listar_anuncios(request, 'sidebar')

def anuncios_produtos(request):
    """Retorna anúncios para a posição Produtos"""
    return listar_anuncios(request, 'produtos')

def anuncios_rodape(request):
    """Retorna anúncios para a posição Rodapé"""
    return listar_anuncios(request, 'rodape')