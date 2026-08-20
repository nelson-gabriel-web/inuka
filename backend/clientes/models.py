from django.db import models
from revendedores.models import Revendedor

class Cliente(models.Model):
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, related_name='clientes')
    nome = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    saldo_devedor_mzn = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Saldo Devedor (MZN)")
    data_criacao = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nome} - {self.revendedor.nome_completo}"
    
    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ['nome']

class Pagamento(models.Model):
    METODO = [
        ('dinheiro', 'Dinheiro'),
        ('transferencia', 'Transferência Bancária'),
        ('mpesa', 'M-Pesa'),
        ('emola', 'E-Mola'),
        ('mkash', 'mKash'),
        ('outro', 'Outro'),
    ]
    
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='pagamentos')
    encomenda = models.ForeignKey('encomendas.Encomenda', on_delete=models.CASCADE, related_name='pagamentos')
    valor = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor (MZN)")
    metodo = models.CharField(max_length=20, choices=METODO, default='dinheiro')
    data_pagamento = models.DateTimeField(auto_now_add=True)
    observacao = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Pagamento {self.id} - {self.cliente.nome} - {self.valor} MZN"
    
    class Meta:
        verbose_name = "Pagamento"
        verbose_name_plural = "Pagamentos"
        ordering = ['-data_pagamento']