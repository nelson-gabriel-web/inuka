from django.db import models
from revendedores.models import Revendedor
import secrets

class APIKey(models.Model):
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, related_name='api_keys')
    key = models.CharField(max_length=64, unique=True, default=secrets.token_urlsafe)
    nome = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    ultimo_uso = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.nome} - {self.revendedor.nome_completo}"

# Create your models here.
