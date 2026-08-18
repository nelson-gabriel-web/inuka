from django.db import models

class Produto(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    preco_usd = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    preco_mzn = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    preco_zar = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock_atual = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=5)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    
    # NOVO CAMPO PARA UPLOAD DIRETO
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True, verbose_name="Imagem do Produto")
    
    is_active = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.codigo}"
    
    # Preços nas diferentes moedas
    preco_usd = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Preço em USD", blank=True, null=True)
    preco_mzn = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Preço em MZN", blank=True, null=True)
    preco_zar = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Preço em ZAR (Rand)", default=0.00)
    stock_atual = models.IntegerField(default=0, verbose_name="Stock Atual")
    stock_minimo = models.IntegerField(default=5, verbose_name="Stock Mínimo")
    categoria = models.CharField(max_length=100, verbose_name="Categoria", blank=True, null=True)
    imagem_url = models.CharField(max_length=255, verbose_name="URL da Imagem", blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    
    class Meta:
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"
        ordering = ['nome']
    
    def __str__(self):
        return f"{self.nome} - {self.codigo}"
    
    def preco_em_mzn(self, taxa_cambio):
        if taxa_cambio:
            return self.preco_usd * taxa_cambio
        return self.preco_mzn
    
    def preco_em_zar(self, taxa_cambio):
        if taxa_cambio:
            return self.preco_usd * taxa_cambio
        return self.preco_zar