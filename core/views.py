from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum

from .models import Usuario, Categoria, Solicitacao, Eventos
from .serilizers import EventosSerializer, UsuarioSerializer, CategoriaSerializer, SolicitacaoSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('matricula')
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('id_categoria')
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]


class EventosViewSet(viewsets.ModelViewSet):
    queryset = Eventos.objects.all().order_by('id_evento')
    serializer_class = EventosSerializer
    permission_classes = [AllowAny]


class SolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = Solicitacao.objects.all().order_by('id_solicitacao')
    serializer_class = SolicitacaoSerializer
    permission_classes = [AllowAny]

