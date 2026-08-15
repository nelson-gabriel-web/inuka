from django.db import models
from revendedores.models import Revendedor

class Deposito(models.Model):
    # Métodos de pagamento
    METODO = [
        ('MPESA', 'M-Pesa'),
        ('EMOLA', 'E-Mola'),
        ('MKASH', 'mKash'),
        ('VISA', 'Visa'),
    ]
    
    STATUS = [
        ('pendente', 'Pendente'),
        ('confirmado', 'Confirmado'),
        ('falhou', 'Falhou'),
    ]
    
    MOEDA = [
        ('MZN', 'Metical'),
        ('USD', 'Dólar Americano'),
        ('ZAR', 'Rand Sul-Africano'),
    ]
    
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, verbose_name="Revendedor")
    metodo = models.CharField(max_length=20, choices=METODO, verbose_name="Método de Pagamento")
    valor = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Depositado")
    moeda = models.CharField(max_length=3, choices=MOEDA, verbose_name="Moeda")
    referencia_externa = models.CharField(max_length=100, verbose_name="Referência Externa", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS, default='pendente', verbose_name="Status")
    data_deposito = models.DateTimeField(auto_now_add=True, verbose_name="Data do Depósito")
    data_confirmacao = models.DateTimeField(verbose_name="Data de Confirmação", blank=True, null=True)
    
    class Meta:
        verbose_name = "Depósito"
        verbose_name_plural = "Depósitos"
        ordering = ['-data_deposito']
    
    def __str__(self):
        return f"{self.revendedor.nome_completo} - {self.valor} {self.moeda}"
    
    def confirmar(self):
        from django.utils import timezone
        self.status = 'confirmado'
        self.data_confirmacao = timezone.now()
        self.save()


class Conversao(models.Model):
    MOEDA = [
        ('MZN', 'Metical'),
        ('USD', 'Dólar Americano'),
        ('ZAR', 'Rand Sul-Africano'),
    ]
    
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, verbose_name="Revendedor")
    valor_origem = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor de Origem")
    moeda_origem = models.CharField(max_length=3, choices=MOEDA, verbose_name="Moeda de Origem")
    valor_destino = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor de Destino")
    moeda_destino = models.CharField(max_length=3, choices=MOEDA, verbose_name="Moeda de Destino")
    taxa_cambio = models.DecimalField(max_digits=10, decimal_places=4, verbose_name="Taxa de Câmbio")
    data_conversao = models.DateTimeField(auto_now_add=True, verbose_name="Data da Conversão")
    
    class Meta:
        verbose_name = "Conversão"
        verbose_name_plural = "Conversões"
        ordering = ['-data_conversao']
    
    def __str__(self):
        return f"{self.revendedor.nome_completo} - {self.valor_origem} {self.moeda_origem} → {self.valor_destino} {self.moeda_destino}"


class Transacao(models.Model):
    TIPO = [
        ('deposito', 'Depósito'),
        ('conversao', 'Conversão'),
        ('compra', 'Compra'),
        ('estorno', 'Estorno'),
    ]
    
    MOEDA = [
        ('MZN', 'Metical'),
        ('USD', 'Dólar Americano'),
        ('ZAR', 'Rand Sul-Africano'),
    ]
    
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, verbose_name="Revendedor")
    tipo = models.CharField(max_length=20, choices=TIPO, verbose_name="Tipo de Transação")
    valor = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor")
    moeda = models.CharField(max_length=3, choices=MOEDA, verbose_name="Moeda")
    saldo_anterior = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Saldo Anterior")
    saldo_novo = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Saldo Novo")
    referencia_id = models.IntegerField(verbose_name="ID da Referência", blank=True, null=True)
    data_transacao = models.DateTimeField(auto_now_add=True, verbose_name="Data da Transação")
    
    class Meta:
        verbose_name = "Transação"
        verbose_name_plural = "Transações"
        ordering = ['-data_transacao']
    
    def __str__(self):
        return f"{self.revendedor.nome_completo} - {self.tipo} - {self.valor} {self.moeda}"


class TaxaCambio(models.Model):
    MOEDA = [
        ('MZN', 'Metical'),
        ('USD', 'Dólar Americano'),
        ('ZAR', 'Rand Sul-Africano'),
    ]
    
    moeda_origem = models.CharField(max_length=3, choices=MOEDA, verbose_name="Moeda de Origem")
    moeda_destino = models.CharField(max_length=3, choices=MOEDA, verbose_name="Moeda de Destino")
    taxa_compra = models.DecimalField(max_digits=10, decimal_places=4, verbose_name="Taxa de Compra")
    taxa_venda = models.DecimalField(max_digits=10, decimal_places=4, verbose_name="Taxa de Venda")
    data_atualizacao = models.DateTimeField(auto_now=True, verbose_name="Data de Atualização")
    fonte = models.CharField(max_length=100, verbose_name="Fonte", blank=True, null=True)
    
    class Meta:
        verbose_name = "Taxa de Câmbio"
        verbose_name_plural = "Taxas de Câmbio"
        ordering = ['-data_atualizacao']
        unique_together = ['moeda_origem', 'moeda_destino']
    
    def __str__(self):
        return f"{self.moeda_origem}/{self.moeda_destino} - {self.taxa_venda}"


class Notificacao(models.Model):
    TIPO = [
        ('email', 'E-mail'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
    ]
    
    revendedor = models.ForeignKey(Revendedor, on_delete=models.CASCADE, verbose_name="Revendedor")
    titulo = models.CharField(max_length=255, verbose_name="Título")
    mensagem = models.TextField(verbose_name="Mensagem")
    tipo = models.CharField(max_length=20, choices=TIPO, default='email', verbose_name="Tipo")
    lida = models.BooleanField(default=False, verbose_name="Lida")
    data_envio = models.DateTimeField(auto_now_add=True, verbose_name="Data de Envio")
    data_leitura = models.DateTimeField(verbose_name="Data de Leitura", blank=True, null=True)
    
    class Meta:
        verbose_name = "Notificação"
        verbose_name_plural = "Notificações"
        ordering = ['-data_envio']
    
    def __str__(self):
        return f"{self.revendedor.nome_completo} - {self.titulo}"
    
    def marcar_como_lida(self):
        from django.utils import timezone
        self.lida = True
        self.data_leitura = timezone.now()
        self.save()