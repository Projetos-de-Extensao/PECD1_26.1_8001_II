from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

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


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    senha = request.data.get('senha')

    if not email or not senha:
        return Response(
            {'detail': 'Email e senha são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )

    usuario = Usuario.objects.filter(email=email, senha=senha).first()

    if usuario:
        return Response({
            'detail': 'Login realizado com sucesso',
            'usuario': {
                'id': usuario.id,
                'nome': usuario.nome,
                'email': usuario.email,
            }
        }, status=status.HTTP_200_OK)

    return Response(
        {'detail': 'Email ou senha inválidos'},
        status=status.HTTP_401_UNAUTHORIZED
    )