from django.db import models

class Loja(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome da Loja")
    provincia = models.CharField(max_length=100, verbose_name="Província")
    cidade = models.CharField(max_length=100, verbose_name="Cidade")
    endereco = models.CharField(max_length=255, verbose_name="Endereço", blank=True, null=True)
    telefone = models.CharField(max_length=20, verbose_name="Telefone", blank=True, null=True)
    horario_funcionamento = models.CharField(max_length=100, verbose_name="Horário", blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name="Ativa")
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    
    class Meta:
        verbose_name = "Loja"
        verbose_name_plural = "Lojas"
        ordering = ['provincia', 'nome']
    
    def __str__(self):
        return f"{self.nome} - {self.cidade}"