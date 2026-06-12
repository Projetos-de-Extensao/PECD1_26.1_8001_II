from rest_framework import serializers
from .models import Usuario, Categoria, Solicitacao, Eventos


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class EventosSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(source='categoria.atividade', read_only=True)

    class Meta:
        model = Eventos
        fields = '__all__'

class SolicitacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitacao
        fields = '__all__'