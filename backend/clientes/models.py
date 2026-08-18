from django.db import models
from revendedores.models import Revendedor

class Cliente(models.Model):
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, related_name='clientes')
    nome = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    saldo_devedor = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    data_criacao = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nome} - {self.revendedor.nome_completo}"
    
    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ['nome']