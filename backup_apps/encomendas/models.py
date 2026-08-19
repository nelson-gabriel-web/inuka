from django.db import models
from revendedores.models import Revendedor
from clientes.models import Cliente
from produtos.models import Produto

class Encomenda(models.Model):
    STATUS = [
        ('pendente', 'Pendente'),
        ('paga', 'Paga'),
        ('entregue', 'Entregue'),
        ('cancelada', 'Cancelada'),
    ]
    
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, related_name='encomendas')
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='encomendas')
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_entrega = models.DateTimeField(blank=True, null=True)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    comissao_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS, default='pendente')
    observacao = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Encomenda #{self.id} - {self.cliente.nome}"
    
    def calcular_totais(self):
        """Recalcula o valor total e comissão da encomenda"""
        total = 0
        comissao = 0
        for item in self.itens.all():
            total += item.subtotal
            comissao += item.comissao_item
        self.valor_total = total
        self.comissao_total = comissao
        self.save()
        return total, comissao
    
    class Meta:
        verbose_name = "Encomenda"
        verbose_name_plural = "Encomendas"
        ordering = ['-data_criacao']


class ItemEncomenda(models.Model):
    encomenda = models.ForeignKey(Encomenda, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    comissao_item = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.subtotal = self.quantidade * self.preco_unitario
        # Calcular comissão baseada no percentual do produto
        self.comissao_item = self.produto.calcular_comissao(self.subtotal)
        super().save(*args, **kwargs)
        # Atualizar totais da encomenda
        self.encomenda.calcular_totais()

    def __str__(self):
        return f"{self.produto.nome} x {self.quantidade}"
    
    class Meta:
        verbose_name = "Item da Encomenda"
        verbose_name_plural = "Itens da Encomenda"