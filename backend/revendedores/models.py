from django.db import models

class Revendedor(models.Model):
    # Tipos de documento
    TIPO_DOCUMENTO = [
        ('BI', 'Bilhete de Identidade'),
        ('PASSAPORTE', 'Passaporte'),
        ('DIRE', 'DIRE'),
    ]
    
    # Dados pessoais
    codigo_unico = models.CharField(max_length=20, unique=True, verbose_name="Código Único")
    nome_completo = models.CharField(max_length=255, verbose_name="Nome Completo")
    email = models.EmailField(unique=True, verbose_name="E-mail")
    telefone = models.CharField(max_length=20, unique=True, verbose_name="Telefone")
    
    # Documentação
    documento_tipo = models.CharField(max_length=20, choices=TIPO_DOCUMENTO, verbose_name="Tipo de Documento")
    documento_numero = models.CharField(max_length=50, unique=True, verbose_name="Número do Documento")
    documento_upload = models.CharField(max_length=255, verbose_name="Upload do Documento", blank=True, null=True)
    
    # Localização
    data_nascimento = models.DateField(verbose_name="Data de Nascimento", blank=True, null=True)
    provincia = models.CharField(max_length=100, verbose_name="Província")
    cidade = models.CharField(max_length=100, verbose_name="Cidade")
    bairro = models.CharField(max_length=100, verbose_name="Bairro", blank=True, null=True)
    
    # Relacionamentos
    loja_recolha = models.CharField(max_length=100, blank=True, null=True, verbose_name="Loja de Recolha")
    
    # Autenticação
    password_hash = models.CharField(max_length=255, verbose_name="Password")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    
    # Datas
    data_registo = models.DateTimeField(auto_now_add=True, verbose_name="Data de Registo")
    data_ultimo_login = models.DateTimeField(verbose_name="Último Login", blank=True, null=True)
    
    class Meta:
        verbose_name = "Revendedor"
        verbose_name_plural = "Revendedores"
        ordering = ['nome_completo']
    
    def __str__(self):
        return f"{self.nome_completo} - {self.codigo_unico}"