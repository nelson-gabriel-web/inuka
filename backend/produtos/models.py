from django.db import models

class Produto(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    
    # Preço em Metical (MZN) - Moeda principal
    preco_mzn = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Preço (MZN)")
    
    # Comissão do revendedor em Metical (MZN)
    comissao_mzn = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Comissão (MZN)")
    
    # Percentual de comissão (opcional, para cálculo automático)
    comissao_percentual = models.DecimalField(max_digits=5, decimal_places=2, default=20.00, help_text="% de comissão para o revendedor")
    
    stock_atual = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=5)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.codigo}"
    
    def save(self, *args, **kwargs):
        # Calcular comissão em MZN automaticamente
        if self.preco_mzn and self.comissao_percentual:
            self.comissao_mzn = (self.preco_mzn * self.comissao_percentual) / 100
        super().save(*args, **kwargs)