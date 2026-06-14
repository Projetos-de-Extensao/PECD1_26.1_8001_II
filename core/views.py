import uuid

from django.contrib.auth.hashers import check_password, make_password
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .authentication import gerar_token
from .models import Categoria, Eventos, Solicitacao, Usuario
from .permissions import IsFuncionario
from .serilizers import CategoriaSerializer, EventosSerializer, SolicitacaoSerializer, UsuarioSerializer
from .services import (
    STATUS_APROVADA,
    STATUS_PENDENTE,
    aprovar_solicitacao,
    metas_do_curso,
    rejeitar_solicitacao,
    solicitar_ajuste,
    totais_aprovados,
)


def erro(mensagem, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({'mensagem': mensagem}, status=status_code)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('matricula')
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.action in ['login', 'criar_usuario', 'recuperar_senha']:
            return [AllowAny()]
        if self.action in ['list', 'retrieve', 'lista_alunos', 'criar_funcionario', 'desativar_usuario', 'ativar_usuario']:
            return [IsFuncionario()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    def login(self, request):
        email = request.data.get('email')
        senha = request.data.get('senha')

        if not email or not senha:
            return erro('Email e senha sao obrigatorios.')

        usuario = Usuario.objects.filter(email=email, ativo=True).first()
        if not usuario:
            return erro('Credenciais invalidas.', status.HTTP_401_UNAUTHORIZED)

        senha_ok = check_password(senha, usuario.senha)
        if not senha_ok and usuario.senha == senha:
            usuario.senha = make_password(senha)
            usuario.save(update_fields=['senha'])
            senha_ok = True

        if not senha_ok:
            return erro('Credenciais invalidas.', status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(usuario)
        return Response({
            'mensagem': 'Login realizado com sucesso!',
            'token': gerar_token(usuario),
            'token_type': 'Bearer',
            'expires_in': 1800,
            'usuario': serializer.data,
        })

    @action(detail=False, methods=['get'], url_path='meus-dados')
    def meus_dados(self, request):
        usuario = request.user
        nomes = usuario.nome.split()
        iniciais = ''.join([parte[0].upper() for parte in (nomes[:1] + nomes[-1:]) if parte])[:2] or 'U'

        return Response({
            'iniciais': iniciais,
            'nome': nomes[0] if nomes else '',
            'nomeCompleto': usuario.nome,
            'matricula': usuario.matricula,
            'email': usuario.email,
            'curso': usuario.curso,
            'anoEntrada': usuario.ano_entrada,
            'periodo': usuario.periodo,
            'is_funcionario': usuario.is_funcionario,
        })

    @action(detail=False, methods=['post'], url_path='mudar-senha')
    def mudar_senha(self, request):
        usuario = request.user
        senha_atual = request.data.get('senhaAtual')
        senha_nova = request.data.get('senhaNova')

        if not senha_atual or not senha_nova:
            return erro('Senha atual e nova senha sao obrigatorias.')

        if not check_password(senha_atual, usuario.senha):
            return erro('Senha atual incorreta.')

        usuario.senha = make_password(senha_nova)
        usuario.save(update_fields=['senha'])
        return Response({'mensagem': 'Senha alterada com sucesso!'})

    @action(detail=False, methods=['post'], url_path='recuperar-senha', permission_classes=[AllowAny])
    def recuperar_senha(self, request):
        email = request.data.get('email')
        matricula = request.data.get('matricula')
        senha_nova = request.data.get('senhaNova')

        if not email or not matricula or not senha_nova:
            return erro('Email, matricula e nova senha sao obrigatorios.')

        if len(senha_nova) < 8:
            return erro('A nova senha deve ter pelo menos 8 caracteres.')

        usuario = Usuario.objects.filter(email=email, matricula=matricula, ativo=True).first()
        if not usuario:
            return erro('Dados nao conferem.', status.HTTP_404_NOT_FOUND)

        usuario.senha = make_password(senha_nova)
        usuario.save(update_fields=['senha'])
        return Response({'mensagem': 'Senha redefinida com sucesso!'})

    @action(detail=False, methods=['get'], url_path='horas-totais')
    def horas_totais(self, request):
        usuario = request.user
        total_horas, total_internas, total_externas = totais_aprovados(usuario)
        meta_total, meta_int, meta_ext = metas_do_curso(usuario.curso)

        return Response({
            'horas_totais': total_horas,
            'horas_computadas': total_horas,
            'horas_internas': total_internas,
            'horas_externas': total_externas,
            'meta_total': meta_total,
            'meta_internas': meta_int,
            'meta_externas': meta_ext,
        })

    @action(detail=False, methods=['get'], url_path='lista')
    def lista_alunos(self, request):
        usuarios = Usuario.objects.all().order_by('matricula')
        page = self.paginate_queryset(usuarios)
        serializer = self.get_serializer(page or usuarios, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='desativar')
    def desativar_usuario(self, request):
        matricula = request.data.get('matricula')
        if not matricula:
            return erro('Matricula e obrigatoria.')
        usuario = Usuario.objects.filter(matricula=matricula).first()
        if not usuario:
            return erro('Usuario nao encontrado.', status.HTTP_404_NOT_FOUND)
        usuario.ativo = False
        usuario.save(update_fields=['ativo'])
        return Response({'mensagem': 'Usuario desativado com sucesso!'})

    @action(detail=False, methods=['post'], url_path='ativar')
    def ativar_usuario(self, request):
        matricula = request.data.get('matricula')
        if not matricula:
            return erro('Matricula e obrigatoria.')
        usuario = Usuario.objects.filter(matricula=matricula).first()
        if not usuario:
            return erro('Usuario nao encontrado.', status.HTTP_404_NOT_FOUND)
        usuario.ativo = True
        usuario.save(update_fields=['ativo'])
        return Response({'mensagem': 'Usuario ativado com sucesso!'})

    @action(detail=False, methods=['post'], url_path='criar', permission_classes=[AllowAny])
    def criar_usuario(self, request):
        dados_usuario = {
            'matricula': request.data.get('matricula'),
            'nome': request.data.get('nome'),
            'email': request.data.get('email'),
            'senha': request.data.get('senha'),
            'curso': request.data.get('curso'),
            'ano_entrada': request.data.get('anoEntrada', '2026'),
            'periodo': request.data.get('periodo', '2o Periodo'),
            'ativo': True,
            'is_funcionario': False,
        }
        serializer = self.get_serializer(data=dados_usuario)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='criar-funcionario')
    def criar_funcionario(self, request):
        dados_funcionario = {
            'matricula': f"FUNC-{uuid.uuid4().hex[:8].upper()}",
            'nome': request.data.get('nome'),
            'email': request.data.get('email'),
            'senha': request.data.get('senha'),
            'curso': 'Administrativo',
            'is_funcionario': True,
            'ativo': True,
        }
        serializer = self.get_serializer(data=dados_funcionario)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('id_categoria')
    serializer_class = CategoriaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'lista']:
            return [IsAuthenticated()]
        return [IsFuncionario()]

    @action(detail=False, methods=['post'], url_path='criar')
    def criar_categoria(self, request):
        serializer = self.get_serializer(data={
            'atividade': request.data.get('atividade'),
            'categoria': request.data.get('categoria'),
            'tipo': request.data.get('tipo'),
            'horas': request.data.get('horas'),
            'ativo': request.data.get('ativo', True),
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='desativar')
    def desativar(self, request):
        categoria = self.get_queryset().filter(id_categoria=request.data.get('id_categoria')).first()
        if not categoria:
            return erro('Categoria nao encontrada.', status.HTTP_404_NOT_FOUND)
        categoria.ativo = False
        categoria.save(update_fields=['ativo'])
        return Response({'mensagem': 'Categoria desativada com sucesso!'})

    @action(detail=False, methods=['post'], url_path='ativar')
    def ativar(self, request):
        categoria = self.get_queryset().filter(id_categoria=request.data.get('id_categoria')).first()
        if not categoria:
            return erro('Categoria nao encontrada.', status.HTTP_404_NOT_FOUND)
        categoria.ativo = True
        categoria.save(update_fields=['ativo'])
        return Response({'mensagem': 'Categoria ativada com sucesso!'})

    @action(detail=False, methods=['get'], url_path='lista')
    def lista(self, request):
        serializer = self.get_serializer(self.get_queryset().filter(ativo=True), many=True)
        return Response(serializer.data)


class EventosViewSet(viewsets.ModelViewSet):
    queryset = Eventos.objects.select_related('categoria').all().order_by('id_evento')
    serializer_class = EventosSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'lista_eventos']:
            return [IsAuthenticated()]
        return [IsFuncionario()]

    @action(detail=False, methods=['post'], url_path='criar')
    def criar_evento(self, request):
        serializer = self.get_serializer(data={
            'nome': request.data.get('nome'),
            'categoria': request.data.get('categoria'),
            'data': request.data.get('data'),
            'hora': request.data.get('hora'),
            'horas': request.data.get('horas'),
            'curso_alvo': request.data.get('curso_alvo') or request.data.get('cursoAlvo'),
            'palestrante': request.data.get('palestrante'),
            'unidade': request.data.get('unidade'),
            'ativo': True,
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='desativar')
    def desativar_evento(self, request):
        evento = self.get_queryset().filter(id_evento=request.data.get('id_evento')).first()
        if not evento:
            return erro('Evento nao encontrado.', status.HTTP_404_NOT_FOUND)
        evento.ativo = False
        evento.save(update_fields=['ativo'])
        return Response({'mensagem': 'Evento desativado com sucesso!'})

    @action(detail=False, methods=['post'], url_path='ativar')
    def ativar_evento(self, request):
        evento = self.get_queryset().filter(id_evento=request.data.get('id_evento')).first()
        if not evento:
            return erro('Evento nao encontrado.', status.HTTP_404_NOT_FOUND)
        evento.ativo = True
        evento.save(update_fields=['ativo'])
        return Response({'mensagem': 'Evento ativado com sucesso!'})

    @action(detail=False, methods=['get'], url_path='lista')
    def lista_eventos(self, request):
        status_ativo = request.query_params.get('ativo', 'true').lower()
        eventos = self.get_queryset()

        if status_ativo in ['false', '0', 'inativo', 'inativos']:
            eventos = eventos.filter(ativo=False)
        elif status_ativo not in ['todos', 'all']:
            eventos = eventos.filter(ativo=True)

        serializer = self.get_serializer(eventos, many=True)
        return Response(serializer.data)


class SolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = Solicitacao.objects.select_related('aluno', 'categoria', 'evento', 'avaliado_por').all()
    serializer_class = SolicitacaoSerializer

    def get_queryset(self):
        qs = Solicitacao.objects.select_related('aluno', 'categoria', 'evento', 'avaliado_por').order_by('-id_solicitacao')
        usuario = self.request.user
        if usuario and usuario.is_authenticated and usuario.is_funcionario:
            return qs
        return qs.filter(aluno=usuario)

    def get_permissions(self):
        if self.action in ['aprovar_solicitacao', 'rejeitar_solicitacao', 'solicitar_ajuste_solicitacao', 'admin']:
            return [IsFuncionario()]
        return [IsAuthenticated()]

    def _aplicar_filtros_admin(self, qs):
        aluno = self.request.query_params.get('aluno')
        tipo = self.request.query_params.get('tipo')
        status_param = self.request.query_params.get('status')
        data_inicio = self.request.query_params.get('data_inicio')
        data_fim = self.request.query_params.get('data_fim')

        if aluno:
            qs = qs.filter(aluno__nome__icontains=aluno) | qs.filter(aluno__matricula__icontains=aluno)
        if tipo:
            qs = qs.filter(tipo=tipo)
        if status_param:
            qs = qs.filter(status=status_param)
        if data_inicio:
            qs = qs.filter(data__gte=data_inicio)
        if data_fim:
            qs = qs.filter(data__lte=data_fim)
        return qs.order_by('-id_solicitacao')

    @action(detail=False, methods=['get'], url_path='admin')
    def admin(self, request):
        qs = self._aplicar_filtros_admin(self.get_queryset())
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page or qs, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='criar-externa')
    def criar_externa(self, request):
        dados = request.data.copy()
        dados['aluno'] = request.user.matricula
        dados['tipo'] = 'Externa'
        dados['status'] = STATUS_PENDENTE

        serializer = self.get_serializer(data=dados)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='criar-interna')
    def criar_interna(self, request):
        evento_id = request.data.get('evento_id')
        if not evento_id:
            return erro('ID do Evento e obrigatorio.')

        evento = Eventos.objects.select_related('categoria').filter(id_evento=evento_id, ativo=True).first()
        if not evento:
            return erro('Evento nao encontrado no sistema.', status.HTTP_404_NOT_FOUND)

        if Solicitacao.objects.filter(aluno=request.user, evento=evento).exists():
            return erro('Voce ja registrou presenca neste evento!')

        categoria_obj = evento.categoria or Categoria.objects.filter(ativo=True).first()
        if not categoria_obj:
            return erro('Evento sem categoria valida.')

        solicitacao = Solicitacao.objects.create(
            aluno=request.user,
            evento=evento,
            categoria=categoria_obj,
            data=evento.data,
            horas=evento.horas,
            tipo='Interna',
            nome_atividade=evento.nome,
            status=STATUS_APROVADA,
        )
        return Response(self.get_serializer(solicitacao).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='aprovar')
    def aprovar_solicitacao(self, request):
        solicitacao = self.get_queryset().filter(id_solicitacao=request.data.get('id_solicitacao')).first()
        if not solicitacao:
            return erro('Solicitacao nao encontrada.', status.HTTP_404_NOT_FOUND)
        aprovar_solicitacao(solicitacao, request.user)
        return Response({'mensagem': 'Solicitacao aprovada com sucesso!'})

    @action(detail=False, methods=['post'], url_path='rejeitar')
    def rejeitar_solicitacao(self, request):
        solicitacao = self.get_queryset().filter(id_solicitacao=request.data.get('id_solicitacao')).first()
        if not solicitacao:
            return erro('Solicitacao nao encontrada.', status.HTTP_404_NOT_FOUND)
        rejeitar_solicitacao(solicitacao, request.user, request.data.get('motivo'))
        return Response({'mensagem': 'Solicitacao rejeitada com sucesso!'})

    @action(detail=False, methods=['post'], url_path='solicitar-ajuste')
    def solicitar_ajuste_solicitacao(self, request):
        solicitacao = self.get_queryset().filter(id_solicitacao=request.data.get('id_solicitacao')).first()
        if not solicitacao:
            return erro('Solicitacao nao encontrada.', status.HTTP_404_NOT_FOUND)
        solicitar_ajuste(solicitacao, request.user, request.data.get('motivo'))
        return Response({'mensagem': 'Ajuste solicitado com sucesso!'})

    @action(detail=False, methods=['get'], url_path='lista')
    def lista_solicitacoes(self, request):
        qs = self.get_queryset().filter(aluno=request.user)
        status_param = request.query_params.get('status')
        tipo = request.query_params.get('tipo')
        if status_param:
            qs = qs.filter(status=status_param)
        if tipo:
            qs = qs.filter(tipo=tipo)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
