import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inuka.settings')
django.setup()

from produtos.models import Produto

# Taxa de conversão ZAR -> MZN (ajuste conforme necessário)
# 1 ZAR = 3.4 MZN (exemplo - ajuste para a taxa real)
TAXA_ZAR_MZN = Decimal('3.4')

print("🚀 ATUALIZANDO PRODUTOS PARA METICAL (MZN)...")

produtos_atualizados = 0

for produto in Produto.objects.all():
    # Se o produto tiver preco_zar antigo, converter para MZN
    if hasattr(produto, 'preco_zar') and produto.preco_zar:
        preco_mzn = produto.preco_zar * TAXA_ZAR_MZN
        produto.preco_mzn = preco_mzn
        # Calcular comissão em MZN
        produto.comissao_mzn = (preco_mzn * produto.comissao_percentual) / 100
        produto.save()
        produtos_atualizados += 1
        print(f"  ✅ {produto.codigo} - {produto.nome}: {preco_mzn:.2f} MZN (Comissão: {produto.comissao_mzn:.2f} MZN)")

print(f"\n📊 Total de produtos atualizados: {produtos_atualizados}")