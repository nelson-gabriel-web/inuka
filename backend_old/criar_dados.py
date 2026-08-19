import os
import django

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inuka.settings')
django.setup()

from lojas.models import Loja
from produtos.models import Produto
from transacoes.models import TaxaCambio

print("🚀 INICIANDO CRIAÇÃO DE DADOS...")

# 1. Criar Lojas
print("\n📌 Criando lojas...")
lojas = [
    {'nome': 'Loja Maputo Centro', 'provincia': 'Maputo', 'cidade': 'Maputo', 
     'endereco': 'Av. 25 de Setembro, 123', 'telefone': '+258 82 123 4567'},
    {'nome': 'Loja Beira', 'provincia': 'Sofala', 'cidade': 'Beira', 
     'endereco': 'Av. Marginal, 456', 'telefone': '+258 82 234 5678'},
    {'nome': 'Loja Nampula', 'provincia': 'Nampula', 'cidade': 'Nampula', 
     'endereco': 'Av. Eduardo Mondlane, 789', 'telefone': '+258 82 345 6789'},
]

for loja in lojas:
    Loja.objects.create(**loja)

print(f"✅ {len(lojas)} lojas criadas com sucesso!")

# 2. Criar Produtos
print("\n📌 Criando produtos...")
produtos = [
    {'codigo': 'INU-001', 'nome': 'Shampoo Hidratante', 
     'descricao': 'Shampoo nutritivo com óleos naturais para cabelos secos.',
     'preco_usd': 12.50, 'stock_atual': 100, 'stock_minimo': 10, 'categoria': 'Cabelo'},
    {'codigo': 'INU-002', 'nome': 'Condicionador', 
     'descricao': 'Condicionador suave para cabelos macios e brilhantes.',
     'preco_usd': 10.00, 'stock_atual': 80, 'stock_minimo': 10, 'categoria': 'Cabelo'},
    {'codigo': 'INU-003', 'nome': 'Batom Matte', 
     'descricao': 'Batom de longa duração com acabamento mate.',
     'preco_usd': 8.75, 'stock_atual': 150, 'stock_minimo': 15, 'categoria': 'Maquilhagem'},
    {'codigo': 'INU-004', 'nome': 'Base Líquida', 
     'descricao': 'Base líquida de alta cobertura com acabamento natural.',
     'preco_usd': 15.30, 'stock_atual': 60, 'stock_minimo': 10, 'categoria': 'Maquilhagem'},
    {'codigo': 'INU-005', 'nome': 'Sérum Anti-idade', 
     'descricao': 'Sérum concentrado com ácido hialurónico para peles maduras.',
     'preco_usd': 25.00, 'stock_atual': 40, 'stock_minimo': 5, 'categoria': 'Facial'},
    {'codigo': 'INU-006', 'nome': 'Protetor Solar', 
     'descricao': 'Protetor solar FPS 50 com textura leve e hidratante.',
     'preco_usd': 18.40, 'stock_atual': 70, 'stock_minimo': 10, 'categoria': 'Facial'},
    {'codigo': 'INU-007', 'nome': 'Máscara Capilar', 
     'descricao': 'Máscara de tratamento intensivo para cabelos danificados.',
     'preco_usd': 22.50, 'stock_atual': 45, 'stock_minimo': 8, 'categoria': 'Cabelo'},
    {'codigo': 'INU-008', 'nome': 'Delineador', 
     'descricao': 'Delineador líquido de alta precisão à prova d\'água.',
     'preco_usd': 6.90, 'stock_atual': 120, 'stock_minimo': 15, 'categoria': 'Maquilhagem'},
]

for produto in produtos:
    Produto.objects.create(**produto)

print(f"✅ {len(produtos)} produtos criados com sucesso!")

# 3. Criar Taxas de Câmbio
print("\n📌 Criando taxas de câmbio...")
taxas = [
    {'moeda_origem': 'USD', 'moeda_destino': 'MZN', 'taxa_compra': 63.50, 'taxa_venda': 65.50, 
     'fonte': 'Banco de Moçambique'},
    {'moeda_origem': 'USD', 'moeda_destino': 'ZAR', 'taxa_compra': 18.50, 'taxa_venda': 19.20, 
     'fonte': 'Banco Central da África do Sul'},
    {'moeda_origem': 'MZN', 'moeda_destino': 'USD', 'taxa_compra': 0.0150, 'taxa_venda': 0.0158, 
     'fonte': 'Banco de Moçambique'},
    {'moeda_origem': 'MZN', 'moeda_destino': 'ZAR', 'taxa_compra': 0.28, 'taxa_venda': 0.30, 
     'fonte': 'Taxa Cruzada'},
    {'moeda_origem': 'ZAR', 'moeda_destino': 'USD', 'taxa_compra': 0.0520, 'taxa_venda': 0.0540, 
     'fonte': 'Banco Central da África do Sul'},
    {'moeda_origem': 'ZAR', 'moeda_destino': 'MZN', 'taxa_compra': 3.20, 'taxa_venda': 3.40, 
     'fonte': 'Taxa Cruzada'},
]

for taxa in taxas:
    TaxaCambio.objects.create(**taxa)

print(f"✅ {len(taxas)} taxas de câmbio criadas com sucesso!")

# 4. Verificar
print("\n📊 RESUMO FINAL:")
print(f"  🏪 Total de lojas: {Loja.objects.count()}")
print(f"  📦 Total de produtos: {Produto.objects.count()}")
print(f"  💱 Total de taxas: {TaxaCambio.objects.count()}")

print("\n📋 Produtos cadastrados:")
for p in Produto.objects.all():
    print(f"  {p.codigo} - {p.nome} - ${p.preco_usd} - Stock: {p.stock_atual}")

print("\n✅ Dados criados com sucesso!")