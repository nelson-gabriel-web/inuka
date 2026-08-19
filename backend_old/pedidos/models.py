from django.db import models
from revendedores.models import Revendedor
from lojas.models import Loja

class Pedido(models.Model):
    # Status do pedido
    STATUS = [
        ('aguardando_separacao', 'Aguardando Separação'),
        ('em_separacao', 'Em Separação'),
        ('embalado', 'Embalado'),
        ('em_transporte', 'Em Trânsito'),
        ('chegou_loja', 'Chegou à Loja'),
        ('entregue', 'Entregue'),
        ('cancelado', 'Cancelado'),
    ]
    
    MOEDA = [
        ('MZN', 'Metical'),
        ('USD', 'Dólar Americano'),
        ('ZAR', 'Rand Sul-Africano'),
    ]
    
    # Identificação
    numero_pedido = models.CharField(max_length=50, unique=True, verbose_name="Número do Pedido")
    
    # Relacionamentos
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, verbose_name="Revendedor")
    loja_recolha = models.ForeignKey(Loja, on_delete=models.SET_NULL, null=True, verbose_name="Loja de Recolha")
    
    # Valores
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Total")
    moeda = models.CharField(max_length=3, choices=MOEDA, default='USD', verbose_name="Moeda")
    
    # Status
    status = models.CharField(max_length=30, choices=STATUS, default='aguardando_separacao', verbose_name="Status")
    
    # Datas de rastreio
    data_pedido = models.DateTimeField(auto_now_add=True, verbose_name="Data do Pedido")
    data_separacao = models.DateTimeField(verbose_name="Data de Separação", blank=True, null=True)
    data_embalagem = models.DateTimeField(verbose_name="Data de Embalagem", blank=True, null=True)
    data_transporte = models.DateTimeField(verbose_name="Data de Transporte", blank=True, null=True)
    data_chegada_loja = models.DateTimeField(verbose_name="Data de Chegada à Loja", blank=True, null=True)
    data_levantamento = models.DateTimeField(verbose_name="Data de Levantamento", blank=True, null=True)
    
    # Funcionário que fez a entrega
    funcionario_entrega = models.CharField(max_length=100, verbose_name="Funcionário que Entregou", blank=True, null=True)
    
    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        ordering = ['-data_pedido']
    
    def __str__(self):
        return f"{self.numero_pedido} - {self.revendedor.nome_completo}"
    
    def update_status(self, novo_status):
        """Atualiza o status do pedido e regista a data correspondente"""
        from django.utils import timezone
        self.status = novo_status
        if novo_status == 'em_separacao':
            self.data_separacao = timezone.now()
        elif novo_status == 'embalado':
            self.data_embalagem = timezone.now()
        elif novo_status == 'em_transporte':
            self.data_transporte = timezone.now()
        elif novo_status == 'chegou_loja':
            self.data_chegada_loja = timezone.now()
        elif novo_status == 'entregue':
            self.data_levantamento = timezone.now()
        self.save()


class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens', verbose_name="Pedido")
    produto = models.ForeignKey('produtos.Produto', on_delete=models.CASCADE, verbose_name="Produto")
    quantidade = models.IntegerField(verbose_name="Quantidade")
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Preço Unitário")
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Subtotal")
    
    class Meta:
        verbose_name = "Item do Pedido"
        verbose_name_plural = "Itens do Pedido"
    
    def __str__(self):
        return f"{self.pedido.numero_pedido} - {self.produto.nome}"
    
    def save(self, *args, **kwargs):
        self.subtotal = self.quantidade * self.preco_unitario
        super().save(*args, **kwargs)