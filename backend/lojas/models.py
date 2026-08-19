from django.db import models

class Loja(models.Model):
    nome = models.CharField(max_length=100)
    provincia = models.CharField(max_length=100)
    cidade = models.CharField(max_length=100)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Loja"
        verbose_name_plural = "Lojas"