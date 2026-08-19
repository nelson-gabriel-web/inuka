from rest_framework import serializers
from .models import Encomenda, ItemEncomenda
from produtos.models import Produto

class ItemEncomendaSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='produto.nome', read_only=True)
    
    class Meta:
        model = ItemEncomenda
        fields = ['id', 'produto', 'produto_nome', 'quantidade', 'preco_unitario', 'subtotal', 'comissao_item']

class EncomendaSerializer(serializers.ModelSerializer):
    itens = ItemEncomendaSerializer(many=True, read_only=True)
    cliente_nome = serializers.CharField(source='cliente.nome', read_only=True)
    
    class Meta:
        model = Encomenda
        fields = ['id', 'cliente', 'cliente_nome', 'data_criacao', 'valor_total', 'comissao_total', 'status', 'observacao', 'itens']