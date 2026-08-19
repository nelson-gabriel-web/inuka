from django.db import models

class Produto(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    preco_zar = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    comissao_percentual = models.DecimalField(max_digits=5, decimal_places=2, default=20.00, help_text="% de comissão para o revendedor")
    stock_atual = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=5)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.codigo}"
    
    def calcular_comissao(self, preco_venda):
        """Calcula a comissão do revendedor sobre o preço de venda"""
        return (preco_venda * self.comissao_percentual) / 100