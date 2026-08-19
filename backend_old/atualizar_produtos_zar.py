import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inuka.settings')
django.setup()

from produtos.models import Produto

print("🚀 ATUALIZANDO PRODUTOS EXISTENTES PARA ZAR...")

# Dados dos produtos com preços em ZAR
produtos = [
    {
        'codigo': 'INU-001',
        'nome': 'Shampoo Hidratante',
        'descricao': 'Shampoo nutritivo com óleos naturais para cabelos secos.',
        'preco_usd': 12.50,
        'preco_zar': 240.00,
        'stock_atual': 100,
        'categoria': 'Cabelo'
    },
    {
        'codigo': 'INU-002',
        'nome': 'Condicionador',
        'descricao': 'Condicionador suave para cabelos macios e brilhantes.',
        'preco_usd': 10.00,
        'preco_zar': 192.00,
        'stock_atual': 80,
        'categoria': 'Cabelo'
    },
    {
        'codigo': 'INU-003',
        'nome': 'Batom Matte',
        'descricao': 'Batom de longa duração com acabamento mate.',
        'preco_usd': 8.75,
        'preco_zar': 168.00,
        'stock_atual': 150,
        'categoria': 'Maquilhagem'
    },
    {
        'codigo': 'INU-004',
        'nome': 'Base Líquida',
        'descricao': 'Base líquida de alta cobertura com acabamento natural.',
        'preco_usd': 15.30,
        'preco_zar': 293.76,
        'stock_atual': 60,
        'categoria': 'Maquilhagem'
    },
    {
        'codigo': 'INU-005',
        'nome': 'Sérum Anti-idade',
        'descricao': 'Sérum concentrado com ácido hialurónico.',
        'preco_usd': 25.00,
        'preco_zar': 480.00,
        'stock_atual': 40,
        'categoria': 'Facial'
    },
    {
        'codigo': 'INU-006',
        'nome': 'Protetor Solar',
        'descricao': 'Protetor solar FPS 50 com textura leve.',
        'preco_usd': 18.40,
        'preco_zar': 353.28,
        'stock_atual': 70,
        'categoria': 'Facial'
    },
    {
        'codigo': 'INU-007',
        'nome': 'Máscara Capilar',
        'descricao': 'Máscara de tratamento intensivo para cabelos danificados.',
        'preco_usd': 22.50,
        'preco_zar': 432.00,
        'stock_atual': 45,
        'categoria': 'Cabelo'
    },
    {
        'codigo': 'INU-008',
        'nome': 'Delineador',
        'descricao': 'Delineador líquido de alta precisão à prova d\'água.',
        'preco_usd': 6.90,
        'preco_zar': 132.48,
        'stock_atual': 120,
        'categoria': 'Maquilhagem'
    },
]

produtos_atualizados = 0
produtos_criados = 0

for produto_data in produtos:
    codigo = produto_data.pop('codigo')
    
    # Verificar se o produto já existe
    produto, created = Produto.objects.get_or_create(
        codigo=codigo,
        defaults=produto_data
    )
    
    if not created:
        # Atualizar produto existente
        for key, value in produto_data.items():
            setattr(produto, key, value)
        produto.save()
        produtos_atualizados += 1
        print(f"🔄 Atualizado: {codigo} - {produto.nome}")
    else:
        produtos_criados += 1
        print(f"✅ Criado: {codigo} - {produto.nome}")

print(f"\n📊 RESUMO:")
print(f"  ✅ Produtos criados: {produtos_criados}")
print(f"  🔄 Produtos atualizados: {produtos_atualizados}")

# Listar produtos com preços
print("\n📋 PRODUTOS COM PREÇOS EM ZAR:")
for p in Produto.objects.all():
    print(f"  {p.codigo} - {p.nome}: R{p.preco_zar:.2f} (USD: ${p.preco_usd})")