from django.db import models
from django.utils import timezone

class Anuncio(models.Model):
    # Posições disponíveis
    POSICOES = [
        ('hero', 'Hero Banner (Topo)'),
        ('sidebar', 'Barra Lateral'),
        ('produtos', 'Entre Produtos'),
        ('rodape', 'Rodapé'),
        ('popup', 'Popup'),
    ]
    
    titulo = models.CharField(max_length=200, verbose_name="Título do Anúncio")
    descricao = models.TextField(verbose_name="Descrição", blank=True, null=True)
    imagem_url = models.CharField(max_length=500, verbose_name="URL da Imagem", blank=True, null=True)
    link = models.CharField(max_length=500, verbose_name="Link de Destino", blank=True, null=True)
    
    posicao = models.CharField(max_length=20, choices=POSICOES, default='hero', verbose_name="Posição")
    ordem = models.IntegerField(default=0, verbose_name="Ordem de Exibição")
    
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    data_inicio = models.DateTimeField(verbose_name="Data de Início", default=timezone.now)
    data_fim = models.DateTimeField(verbose_name="Data de Fim", blank=True, null=True)
    
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    data_atualizacao = models.DateTimeField(auto_now=True, verbose_name="Data de Atualização")
    
    class Meta:
        verbose_name = "Anúncio"
        verbose_name_plural = "Anúncios"
        ordering = ['posicao', 'ordem']
    
    def __str__(self):
        return f"{self.titulo} - {self.get_posicao_display()}"
    
    def is_ativo(self):
        """Verifica se o anúncio está ativo e dentro do período"""
        if not self.is_active:
            return False
        if self.data_fim and self.data_fim < timezone.now():
            return False
        return True