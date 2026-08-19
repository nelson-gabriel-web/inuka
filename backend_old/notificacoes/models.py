from django.db import models
from revendedores.models import Revendedor

class Notificacao(models.Model):
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, related_name='notificacoes')
    titulo = models.CharField(max_length=255)
    mensagem = models.TextField()
    lida = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)
    link = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.titulo} - {self.revendedor.nome_completo}"