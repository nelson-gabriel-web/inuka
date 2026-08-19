from django.test import TestCase
from django.contrib.auth.hashers import make_password
from revendedores.models import Revendedor
from clientes.models import Cliente
from produtos.models import Produto
from .models import Encomenda, ItemEncomenda

class EncomendaTestCase(TestCase):
    def setUp(self):
        # Criar revendedor
        self.revendedor = Revendedor.objects.create(
            codigo_unico='TEST-001',
            nome_completo='Teste Silva',
            email='teste@email.com',
            telefone='+258 82 123 4567',
            documento_tipo='BI',
            documento_numero='123456789',
            provincia='Maputo',
            cidade='Maputo',
            password_hash=make_password('teste123')
        )
        
        # Criar cliente
        self.cliente = Cliente.objects.create(
            revendedor=self.revendedor,
            nome='João Cliente',
            telefone='+258 82 987 6543'
        )
        
        # Criar produto
        self.produto = Produto.objects.create(
            codigo='TEST-001',
            nome='Produto Teste',
            preco_zar=100.00,
            comissao_percentual=20.00,
            stock_atual=10
        )
    
    def test_criar_encomenda(self):
        encomenda = Encomenda.objects.create(
            revendedor=self.revendedor,
            cliente=self.cliente
        )
        
        ItemEncomenda.objects.create(
            encomenda=encomenda,
            produto=self.produto,
            quantidade=2,
            preco_unitario=100.00
        )
        
        encomenda.calcular_totais()
        
        self.assertEqual(encomenda.valor_total, 200.00)
        self.assertEqual(encomenda.comissao_total, 40.00)
        self.assertEqual(encomenda.status, 'pendente')
    
    def test_mudar_status(self):
        encomenda = Encomenda.objects.create(
            revendedor=self.revendedor,
            cliente=self.cliente
        )
        
        encomenda.status = 'paga'
        encomenda.save()
        
        self.assertEqual(encomenda.status, 'paga')
        
        encomenda.status = 'entregue'
        encomenda.save()
        
        self.assertEqual(encomenda.status, 'entregue')

# Create your tests here.
