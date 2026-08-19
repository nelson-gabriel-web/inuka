from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Encomenda
from notificacoes.models import Notificacao

@receiver(post_save, sender=Encomenda)
def criar_notificacao_encomenda(sender, instance, created, **kwargs):
    if created:
        Notificacao.objects.create(
            revendedor=instance.revendedor,
            titulo="Nova Encomenda Criada",
            mensagem=f"Encomenda #{instance.id} para {instance.cliente.nome} foi criada.",
            link=f"/encomendas/{instance.id}"
        )
    elif instance.status == 'entregue':
        Notificacao.objects.create(
            revendedor=instance.revendedor,
            titulo="Encomenda Entregue",
            mensagem=f"Encomenda #{instance.id} para {instance.cliente.nome} foi entregue.",
            link=f"/encomendas/{instance.id}"
        )