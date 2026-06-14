from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Categoria, Eventos, Solicitacao, Usuario
from .services import STATUS_VALIDOS, validar_arquivo_comprovante, validar_limite_categoria


def validar_email_por_perfil(email, is_funcionario=False):
    dominio = '@ibmec.br' if is_funcionario else '@ibmec.edu.br'
    if not (email or '').lower().endswith(dominio):
        perfil = 'funcionario' if is_funcionario else 'aluno'
        raise serializers.ValidationError(f'E-mail de {perfil} deve terminar com {dominio}.')


class UsuarioSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True, required=False, allow_blank=False)

    class Meta:
        model = Usuario
        fields = [
            'matricula',
            'nome',
            'email',
            'senha',
            'curso',
            'horas_totais',
            'horas_internas',
            'horas_externas',
            'ano_entrada',
            'periodo',
            'ativo',
            'is_funcionario',
        ]
        read_only_fields = ['horas_totais', 'horas_internas', 'horas_externas']

    def validate(self, attrs):
        email = attrs.get('email', getattr(self.instance, 'email', ''))
        is_funcionario = attrs.get('is_funcionario', getattr(self.instance, 'is_funcionario', False))
        validar_email_por_perfil(email, is_funcionario=is_funcionario)
        return attrs

    def create(self, validated_data):
        senha = validated_data.pop('senha', None)
        if not senha:
            raise serializers.ValidationError({'senha': 'Senha e obrigatoria.'})
        validated_data['senha'] = make_password(senha)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        senha = validated_data.pop('senha', None)
        if senha:
            validated_data['senha'] = make_password(senha)
        return super().update(instance, validated_data)


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

    def validate_horas(self, value):
        if value is None or float(value) <= 0:
            raise serializers.ValidationError('Horas deve ser maior que zero.')
        return value


class EventosSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(source='categoria.atividade', read_only=True)

    class Meta:
        model = Eventos
        fields = '__all__'

    def validate_horas(self, value):
        if value is None or float(value) <= 0:
            raise serializers.ValidationError('Horas deve ser maior que zero.')
        return value


class SolicitacaoSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.CharField(source='aluno.nome', read_only=True)
    categoria_nome = serializers.CharField(source='categoria.atividade', read_only=True)
    avaliado_por_nome = serializers.CharField(source='avaliado_por.nome', read_only=True)

    class Meta:
        model = Solicitacao
        fields = '__all__'
        read_only_fields = ['avaliado_por', 'avaliado_em']

    def validate_status(self, value):
        if value not in STATUS_VALIDOS:
            raise serializers.ValidationError('Status invalido.')
        return value

    def validate_tipo(self, value):
        if value not in {'Interna', 'Externa'}:
            raise serializers.ValidationError('Tipo deve ser Interna ou Externa.')
        return value

    def validate_horas(self, value):
        if value is None or float(value) <= 0:
            raise serializers.ValidationError('Horas deve ser maior que zero.')
        return value

    def validate_arquivo(self, value):
        validar_arquivo_comprovante(value)
        return value

    def validate(self, attrs):
        categoria = attrs.get('categoria', getattr(self.instance, 'categoria', None))
        aluno = attrs.get('aluno', getattr(self.instance, 'aluno', None))
        horas = attrs.get('horas', getattr(self.instance, 'horas', 0))
        tipo = attrs.get('tipo', getattr(self.instance, 'tipo', None))

        if categoria and tipo:
            tipo_categoria = 'Interna' if categoria.tipo else 'Externa'
            if tipo != tipo_categoria:
                raise serializers.ValidationError({'tipo': 'Tipo da solicitacao nao corresponde a categoria.'})

        if aluno and categoria:
            validar_limite_categoria(aluno, categoria, horas, getattr(self.instance, 'id_solicitacao', None))

        return attrs
