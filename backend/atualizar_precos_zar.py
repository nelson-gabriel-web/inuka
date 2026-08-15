import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inuka.settings')
django.setup()

from produtos.models import Produto
from transacoes.models import TaxaCambio

print("🚀 ATUALIZANDO PREÇOS PARA ZAR...")

# Buscar taxa de câmbio USD -> ZAR
try:
    taxa = TaxaCambio.objects.get(moeda_origem='USD', moeda_destino='ZAR')
    taxa_zar = taxa.taxa_venda
    print(f"✅ Taxa USD -> ZAR: {taxa_zar}")
except TaxaCambio.DoesNotExist:
    taxa_zar = Decimal('19.20')
    print(f"⚠️ Taxa não encontrada, usando padrão: {taxa_zar}")
    print("   Execute: python criar_dados.py para criar as taxas")

# Atualizar produtos
produtos_atualizados = 0
for produto in Produto.objects.all():
    if produto.preco_usd:
        preco_zar = produto.preco_usd * taxa_zar
        produto.preco_zar = preco_zar
        produto.save()
        produtos_atualizados += 1
        print(f"  {produto.codigo} - {produto.nome}: ${produto.preco_usd} = R{preco_zar:.2f}")

print(f"\n✅ {produtos_atualizados} produtos atualizados com preço em ZAR")

# Listar produtos com preços
print("\n📋 PRODUTOS COM PREÇOS EM ZAR:")
for p in Produto.objects.all():
    print(f"  {p.codigo} - {p.nome}: R{p.preco_zar:.2f} (USD: ${p.preco_usd})")