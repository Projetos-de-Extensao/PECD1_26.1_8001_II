from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Usuario, Categoria, Atividade
from .serilizers import UsuarioSerializer, CategoriaSerializer, AtividadeSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('id')
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('id')
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]


class AtividadeViewSet(viewsets.ModelViewSet):
    queryset = Atividade.objects.select_related('aluno', 'categoria').all().order_by('id')
    serializer_class = AtividadeSerializer
    permission_classes = [AllowAny]