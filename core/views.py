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

    # Endpoint: GET /api/usuarios/meus-dados/
    @action(detail=False, methods=['get'], url_path='meus-dados')
    def meus_dados(self, request):
        # Como ainda não temos autenticação real, pegamos o primeiro usuário do banco
        usuario = Usuario.objects.first()
        if not usuario:
            return Response({"mensagem": "Nenhum usuário cadastrado"}, status=404)
        
        nomes = usuario.nome.split()
        iniciais = ""
        if len(nomes) > 0:
            iniciais += nomes[0][0].upper()
            if len(nomes) > 1:
                iniciais += nomes[-1][0].upper()
        else:
            iniciais = "U"

        dados = {
            "iniciais": iniciais,
            "nome": nomes[0] if nomes else "",
            "nomeCompleto": usuario.nome,
            "matricula": usuario.matricula,
            "email": usuario.email,
            "curso": usuario.curso,
            "anoEntrada": usuario.ano_entrada,
            "periodo": usuario.periodo,
        }
        return Response(dados)

    # Endpoint: POST /api/usuarios/mudar-senha/
    @action(detail=False, methods=['post'], url_path='mudar-senha')
    def mudar_senha(self, request):
        usuario = Usuario.objects.first()
        if not usuario:
            return Response({"mensagem": "Usuário não encontrado."}, status=404)

        senha_atual = request.data.get('senhaAtual')
        senha_nova = request.data.get('senhaNova')

        if usuario.senha != senha_atual:
            return Response({"mensagem": "Senha atual incorreta."}, status=400)
        
        usuario.senha = senha_nova
        usuario.save()
        return Response({"mensagem": "Senha alterada com sucesso!"})
    
    # Endpoint: GET /api/usuarios/horas-totais/
    @action(detail=False, methods=['get'], url_path='horas-totais')
    def horas_totais(self, request):
        # Como ainda não temos autenticação real, pegamos o primeiro usuário do banco
        usuario = Usuario.objects.first()
        if not usuario:
            return Response({"mensagem": "Nenhum usuário cadastrado"}, status=404)
        total_horas = Solicitacao.objects.filter(aluno=usuario, status='Aprovada').aggregate(total=Sum('horas'))['total'] or 0
        
        # Atualizamos as horas computadas (realizadas) com a soma do banco
        usuario.horas_computadas = total_horas
        usuario.horas_totais = total_horas
        usuario.save()

        return Response({
            "horas_totais": usuario.horas_totais,
            "horas_computadas": usuario.horas_computadas
        })

    # Endpoint: GET /api/usuarios/lista/
    @action(detail=False, methods=['get'], url_path='lista')
    def lista_alunos(self, request):
        # pega todos os usuários 
        usuarios = Usuario.objects.all().order_by('matricula')
        serializer = self.get_serializer(usuarios, many=True)
        return Response(serializer.data)
        
    # Endpoint: POST /api/usuarios/desativar/
    @action(detail=False, methods=['post'], url_path='desativar')
    def desativar_usuario(self, request):
        # Desativa um usuário ativo
        pass

    # Endpoint: POST /api/usuarios/ativar/
    @action(detail=False, methods=['post'], url_path='ativar')
    def ativar_usuario(self, request):
        # Ativa um usuário inativo
        pass

    # Endpoint: POST /api/usuarios/criar/
    @action(detail=False, methods=['post'], url_path='criar')
    def criar_usuario(self, request):
        # Cria um novo usuário
        pass

    

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('id_categoria')
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]

    # Endpoint: POST /api/categorias/criar/
    @action(detail=False, methods=['post'], url_path='criar')
    def criar_categoria(self, request):
        # Extraindo os campos exatos que o seu Model espera
        dados_categoria = {
            'atividade': request.data.get('atividade'),
            'categoria': request.data.get('categoria'),
            'tipo': request.data.get('tipo'),  
            'horas': request.data.get('horas'),
            'ativo': request.data.get('ativo', True)  # Padrão para ativo se não for fornecido
        }

        serializer = self.get_serializer(data=dados_categoria)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    # Endpoint: GET /api/categorias/desativar/
    @action(detail=False, methods=['post'], url_path='desativar')
    def desativar(self, request):
        # Desativa uma Categoria ativa
        pass

    # Endpoint: GET /api/categorias/ativar/
    @action(detail=False, methods=['post'], url_path='ativar')
    def ativar(self, request):
        # Ativa uma Categoria inativaa
        pass

    # Endpoint: GET /api/categorias/lista/
    @action(detail=False, methods=['get'], url_path='lista')
    def lista(self, request):
        # pega todas as categorias 
        pass


class EventosViewSet(viewsets.ModelViewSet):
    queryset = Eventos.objects.all().order_by('id_evento')
    serializer_class = EventosSerializer
    permission_classes = [AllowAny]

    # Endpoint: GET /api/eventos/criar/
    @action(detail=False, methods=['post'], url_path='criar')
    def criar_evento(self, request):
        # Cria um novo evento
        pass

    # Endpoint: GET /api/eventos/desativar/
    @action(detail=False, methods=['post'], url_path='desativar')
    def desativar_evento(self, request):
        # Desativa um evento ativo
        pass

    # Endpoint: GET /api/eventos/ativar/
    @action(detail=False, methods=['post'], url_path='ativar')
    def ativar_evento(self, request):
        # Ativa um evento inativo
        pass

    # Endpoint: GET /api/eventos/lista/
    @action(detail=False, methods=['get'], url_path='lista')
    def lista_eventos(self, request):
        # pega todas os eventos 
        pass




class SolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = Solicitacao.objects.all().order_by('id_solicitacao')
    serializer_class = SolicitacaoSerializer
    permission_classes = [AllowAny]

    # Endpoint: POST /api/solicitacoes/criar/
    @action(detail=False, methods=['post'], url_path='criar')
    def criar_solicitacao(self, request):
        # Cria uma nova solicitação de atividade complementar
        pass

    # Endpoint: POST /api/solicitacoes/aprovar/
    @action(detail=False, methods=['post'], url_path='aprovar')
    def aprovar_solicitacao(self, request):
        # Aprova uma solicitação de atividade complementar
        pass

    # Endpoint: POST /api/solicitacoes/rejeitar/
    @action(detail=False, methods=['post'], url_path='rejeitar')
    def rejeitar_solicitacao(self, request):
        # Rejeita uma solicitação de atividade complementar
        pass

    # Endpoint: GET /api/solicitacoes/lista/
    @action(detail=False, methods=['get'], url_path='lista')
    def lista_solicitacoes(self, request):
        # pega todas as solicitações por usuário    
        pass
    