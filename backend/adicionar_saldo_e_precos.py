import os
import django

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inuka.settings')
django.setup()

from lojas.models import Loja
from produtos.models import Produto
from transacoes.models import TaxaCambio, Deposito, Transacao
from revendedores.models import Revendedor
from decimal import Decimal
from django.contrib.auth.hashers import make_password

print("🚀 ADICIONANDO SALDO E PREÇOS...")

# 1. Verificar se há revendedores, se não houver, criar um
print("\n📌 Verificando revendedores...")
revendedor = Revendedor.objects.first()

if not revendedor:
    print("📌 Criando revendedor de teste...")
    # Pegar a primeira loja
    loja = Loja.objects.first()
    
    revendedor = Revendedor.objects.create(
        codigo_unico='RV-2026-0001',
        nome_completo='João Silva Teste',
        email='joao@teste.com',
        telefone='+258 82 123 4567',
        documento_tipo='BI',
        documento_numero='123456789',
        data_nascimento='1990-01-01',
        provincia='Maputo',
        cidade='Maputo',
        bairro='Centro',
        password_hash=make_password('teste123'),
        loja_recolha=loja,
        is_active=True
    )
    print(f"✅ Revendedor criado: {revendedor.nome_completo} - {revendedor.codigo_unico}")
else:
    print(f"✅ Revendedor encontrado: {revendedor.nome_completo} - {revendedor.codigo_unico}")

# 2. Adicionar saldo ao revendedor
print("\n📌 Adicionando saldo ao revendedor...")

# Verificar se já existe saldo
depositos = Deposito.objects.filter(revendedor=revendedor, status='confirmado')
if depositos.count() > 0:
    print(f"⚠️ Revendedor já tem {depositos.count()} depósitos confirmados")
else:
    # Criar depósito em USD
    deposito_usd = Deposito.objects.create(
        revendedor=revendedor,
        metodo='MPESA',
        valor=Decimal('500.00'),
        moeda='USD',
        referencia_externa='TEST-DEP-001',
        status='confirmado'
    )
    print("✅ Depósito de 500.00 USD criado")

    # Criar depósito em MZN
    deposito_mzn = Deposito.objects.create(
        revendedor=revendedor,
        metodo='MPESA',
        valor=Decimal('10000.00'),
        moeda='MZN',
        referencia_externa='TEST-DEP-002',
        status='confirmado'
    )
    print("✅ Depósito de 10,000.00 MZN criado")

    # Criar depósito em ZAR
    deposito_zar = Deposito.objects.create(
        revendedor=revendedor,
        metodo='MPESA',
        valor=Decimal('3000.00'),
        moeda='ZAR',
        referencia_externa='TEST-DEP-003',
        status='confirmado'
    )
    print("✅ Depósito de 3,000.00 ZAR criado")

    # Registrar transações para atualizar saldo
    print("\n📌 Registrando transações...")

    # Transação USD
    Transacao.objects.create(
        revendedor=revendedor,
        tipo='deposito',
        valor=Decimal('500.00'),
        moeda='USD',
        saldo_anterior=Decimal('0.00'),
        saldo_novo=Decimal('500.00'),
        referencia_id=deposito_usd.id
    )
    print("✅ Transação USD registrada")

    # Transação MZN
    Transacao.objects.create(
        revendedor=revendedor,
        tipo='deposito',
        valor=Decimal('10000.00'),
        moeda='MZN',
        saldo_anterior=Decimal('0.00'),
        saldo_novo=Decimal('10000.00'),
        referencia_id=deposito_mzn.id
    )
    print("✅ Transação MZN registrada")

    # Transação ZAR
    Transacao.objects.create(
        revendedor=revendedor,
        tipo='deposito',
        valor=Decimal('3000.00'),
        moeda='ZAR',
        saldo_anterior=Decimal('0.00'),
        saldo_novo=Decimal('3000.00'),
        referencia_id=deposito_zar.id
    )
    print("✅ Transação ZAR registrada")

# 3. Adicionar preços em ZAR aos produtos
print("\n📌 Adicionando preços em ZAR (Rand) aos produtos...")

# Taxa de câmbio USD -> ZAR (venda)
try:
    taxa_zar = TaxaCambio.objects.get(moeda_origem='USD', moeda_destino='ZAR')
    taxa = taxa_zar.taxa_venda
    print(f"✅ Taxa USD -> ZAR: {taxa}")
except TaxaCambio.DoesNotExist:
    taxa = Decimal('19.20')
    print(f"⚠️ Taxa não encontrada, usando padrão: {taxa}")

# Atualizar produtos com preço em ZAR
produtos_atualizados = 0
for produto in Produto.objects.all():
    preco_zar = produto.preco_usd * taxa
    produto.preco_zar = preco_zar
    produto.save()
    produtos_atualizados += 1
    print(f"  {produto.codigo} - {produto.nome}: ${produto.preco_usd} = R{preco_zar:.2f}")

print(f"✅ {produtos_atualizados} produtos atualizados com preço em ZAR")

# 4. Verificar saldo do revendedor
print("\n📊 RESUMO FINAL:")
print(f"  👤 Revendedor: {revendedor.nome_completo}")
print(f"  🆔 Código: {revendedor.codigo_unico}")
print(f"  📧 Email: {revendedor.email}")
print(f"  🔑 Password: teste123")

# Calcular saldo total
from decimal import Decimal
from transacoes.models import Transacao

saldo_usd = Decimal('0')
saldo_mzn = Decimal('0')
saldo_zar = Decimal('0')

transacoes = Transacao.objects.filter(revendedor=revendedor)
for t in transacoes:
    if t.tipo == 'deposito':
        if t.moeda == 'USD':
            saldo_usd += t.valor
        elif t.moeda == 'MZN':
            saldo_mzn += t.valor
        elif t.moeda == 'ZAR':
            saldo_zar += t.valor

print(f"\n💰 SALDO DO REVENDEDOR:")
print(f"  💲 USD: ${saldo_usd:.2f}")
print(f"  📗 MZN: {saldo_mzn:.2f} MT")
print(f"  📘 ZAR: R{saldo_zar:.2f}")

# 5. Listar produtos com preços
print("\n📋 PRODUTOS COM PREÇOS:")
for p in Produto.objects.all():
    print(f"  {p.codigo} - {p.nome}")
    print(f"    💲 USD: ${p.preco_usd:.2f}")
    print(f"    📘 ZAR: R{p.preco_zar:.2f}")
    print(f"    📗 MZN: {p.preco_mzn or 'N/A'}")

print("\n✅ Dados adicionados com sucesso!")
print("\n🔑 Para testar o login use:")
print(f"  📧 Email: {revendedor.email}")
print(f"  🔑 Password: teste123")
print(f"  🆔 Código Único: {revendedor.codigo_unico}")