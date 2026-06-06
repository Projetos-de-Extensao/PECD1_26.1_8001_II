from urllib import request

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

    # Endpoint: POST /api/usuarios/login/
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        email = request.data.get('email')
        senha = request.data.get('senha')

        if not email or not senha:
            return Response({"mensagem": "Email e senha são obrigatórios."}, status=400)

        try:
            usuario = Usuario.objects.get(email=email)
            # TODO: Em um ambiente de produção, as senhas devem ser verificadas com hash (ex: check_password)
            if usuario.senha == senha:
                serializer = self.get_serializer(usuario)
                return Response({
                    "mensagem": "Login realizado com sucesso!",
                    "usuario": serializer.data
                }, status=200)
            else:
                return Response({"mensagem": "Credenciais inválidas."}, status=401)
        except Usuario.DoesNotExist:
            return Response({"mensagem": "Credenciais inválidas."}, status=401)

    # Endpoint: GET /api/usuarios/meus-dados/
    @action(detail=False, methods=['get'], url_path='meus-dados')
    def meus_dados(self, request):
        # Pega a matrícula enviada pelo frontend através dos Headers
        matricula = request.headers.get('X-Usuario-Matricula')
        
        if not matricula:
            return Response({"mensagem": "Usuário não autenticado. Matrícula não fornecida."}, status=401)

        try:
            usuario = Usuario.objects.get(matricula=matricula)
        except Usuario.DoesNotExist:
            return Response({"mensagem": "Usuário não encontrado."}, status=404)

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
        matricula = request.headers.get('X-Usuario-Matricula')
        
        if not matricula:
            return Response({"mensagem": "Usuário não autenticado."}, status=401)

        try:
            usuario = Usuario.objects.get(matricula=matricula)
        except Usuario.DoesNotExist:
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
        matricula = request.headers.get('X-Usuario-Matricula')
        
        if not matricula:
            return Response({"mensagem": "Usuário não autenticado."}, status=401)

        try:
            usuario = Usuario.objects.get(matricula=matricula)
        except Usuario.DoesNotExist:
            return Response({"mensagem": "Usuário não encontrado."}, status=404)
            
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
        matricula = request.data.get('X-Usuario-Matricula')
     
        if not matricula:
            return Response({"mensagem": "Usuário não autenticado."}, status=401)
        
        try:
            usuario = Usuario.objects.get(matricula=matricula)
            usuario.ativo = False
            usuario.save()
            return Response({"mensagem": "Usuário desativado com sucesso!"})
        
        except Usuario.DoesNotExist:    
            return Response({"mensagem": "Usuário não encontrado."}, status=404)

    # Endpoint: POST /api/usuarios/ativar/
    @action(detail=False, methods=['post'], url_path='ativar')
    def ativar_usuario(self, request):
        matricula = request.data.get('X-Usuario-Matricula')

        if not matricula:
            return Response({"mensagem": "Usuário não autenticado."}, status=401)
        try:
            usuario = Usuario.objects.get(matricula=matricula)
            usuario.ativo = True
            usuario.save()
            return Response({"mensagem": "Usuário ativado com sucesso!"})
        except Usuario.DoesNotExist:    
            return Response({"mensagem": "Usuário não encontrado."}, status=404)

    # Endpoint: POST /api/usuarios/criar/
    @action(detail=False, methods=['post'], url_path='criar')
    def criar_usuario(self, request):
        
        dados_usuario = {
            'matricula': request.data.get('matricula'),
            'nome': request.data.get('nome'),
            'email': request.data.get('email'),
            'senha': request.data.get('senha'),
            'curso': request.data.get('curso'),
            'ano_entrada': request.data.get('anoEntrada', '2026'),
            'periodo': request.data.get('periodo', '2º Período'),
            'ativo': True
        }

        serializer = self.get_serializer(data=dados_usuario)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    

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
        categoria_id = request.data.get('id_categoria')
        if not categoria_id:
            return Response({"mensagem": "ID da categoria é obrigatório."}, status=400)
        try:
            categoria = Categoria.objects.get(id_categoria=categoria_id)
            categoria.ativo = False
            categoria.save()
        except Categoria.DoesNotExist:
            return Response({"mensagem": "Categoria não encontrada."}, status=404)
        return Response({"mensagem": "Categoria desativada com sucesso!"})  
         
    # Endpoint: GET /api/categorias/ativar/
    @action(detail=False, methods=['post'], url_path='ativar')
    def ativar(self, request):
        categoria_id = request.data.get('id_categoria')
        if not categoria_id:
            return Response({"mensagem": "ID da categoria é obrigatório."}, status=400)
        try:
            categoria = Categoria.objects.get(id_categoria=categoria_id)
            categoria.ativo = True
            categoria.save()
        except Categoria.DoesNotExist:
            return Response({"mensagem": "Categoria não encontrada."}, status=404)
        return Response({"mensagem": "Categoria ativada com sucesso!"})  
    
    # Endpoint: GET /api/categorias/lista/
    @action(detail=False, methods=['get'], url_path='lista')
    def lista(self, request):
        categorias = Categoria.objects.all().order_by('id_categoria')
        serializer = self.get_serializer(categorias, many=True)
        return Response(serializer.data)

class EventosViewSet(viewsets.ModelViewSet):
    queryset = Eventos.objects.all().order_by('id_evento')
    serializer_class = EventosSerializer
    permission_classes = [AllowAny]

    # Endpoint: GET /api/eventos/criar/
    @action(detail=False, methods=['post'], url_path='criar')
    def criar_evento(self, request):
        dados_evento = {
            'nome': request.data.get('nome'),
            'categoria': request.data.get('categoria'),
            'data': request.data.get('data'),
            'hora': request.data.get('hora'),
            'horas': request.data.get('horas'),
            'curso_alvo': request.data.get('curso_alvo'),
            'palestrante': request.data.get('palestrante'),
            'unidade': request.data.get('unidade'),
            'ativo': True
        }

        serializer = self.get_serializer(data=dados_evento)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    # Endpoint: GET /api/eventos/desativar/
    @action(detail=False, methods=['post'], url_path='desativar')
    def desativar_evento(self, request):
        evento_id = request.data.get('id_evento')
        if not evento_id:
            return Response({"mensagem": "ID do evento é obrigatório."}, status=400)
        try:
            evento = Eventos.objects.get(id_evento=evento_id)
            evento.ativo = False
            evento.save()
        except Eventos.DoesNotExist:
            return Response({"mensagem": "Evento não encontrado."}, status=404)
        return Response({"mensagem": "Evento desativado com sucesso!"})

    # Endpoint: GET /api/eventos/ativar/
    @action(detail=False, methods=['post'], url_path='ativar')
    def ativar_evento(self, request):
        evento_id = request.data.get('id_evento')
        if not evento_id:
            return Response({"mensagem": "ID do evento é obrigatório."}, status=400)
        try:
            evento = Eventos.objects.get(id_evento=evento_id)
            evento.ativo = True
            evento.save()
        except Eventos.DoesNotExist:
            return Response({"mensagem": "Evento não encontrado."}, status=404)
        return Response({"mensagem": "Evento ativado com sucesso!"})

    # Endpoint: GET /api/eventos/lista/
    @action(detail=False, methods=['get'], url_path='lista')
    def lista_eventos(self, request):
        eventos = Eventos.objects.all().order_by('id_evento')
        serializer = self.get_serializer(eventos, many=True)
        return Response(serializer.data)
    
class SolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = Solicitacao.objects.all().order_by('id_solicitacao')
    serializer_class = SolicitacaoSerializer
    permission_classes = [AllowAny]

    # Endpoint: POST /api/solicitacoes/criar-externa/
    @action(detail=False, methods=['post'], url_path='criar-externa')
    def criar_externa(self, request):
        dados = request.data.copy()
        dados['tipo'] = 'Externa'
        dados['status'] = 'Pendente'
        
        matricula = request.headers.get('X-Usuario-Matricula')
        if matricula:
            dados['aluno'] = matricula

        serializer = self.get_serializer(data=dados)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    # Endpoint: POST /api/solicitacoes/criar-interna/ (VIA QR CODE)
    @action(detail=False, methods=['post'], url_path='criar-interna')
    def criar_interna(self, request):
        evento_id = request.data.get('evento_id')
        matricula = request.headers.get('X-Usuario-Matricula')
        
        usuario = None
        if matricula:
            usuario = Usuario.objects.filter(matricula=matricula).first()

        if not evento_id or not usuario:
            return Response({"mensagem": "ID do Evento ou Usuário não informados."}, status=400)

        try:
            evento = Eventos.objects.get(id_evento=evento_id)
        except Eventos.DoesNotExist:
            return Response({"mensagem": "Evento não encontrado no sistema."}, status=404)

        # Validação contra fraudes: Aluno não pode bipar o mesmo QR Code duas vezes
        if Solicitacao.objects.filter(aluno=usuario, evento=evento).exists():
            return Response({"mensagem": "Você já registrou presença neste evento!"}, status=400)

        # Pega a Categoria baseada no nome que está salvo no Evento (ou usa a primeira como fallback)
        categoria_obj = Categoria.objects.filter(atividade=evento.categoria).first() or Categoria.objects.first()

        # Cria a solicitação pré-aprovada com os dados puxados diretamente do Evento
        solicitacao = Solicitacao.objects.create(
            aluno=usuario, evento=evento, categoria=categoria_obj,
            data=evento.data, horas=evento.horas, tipo='Interna',
            nome_atividade=evento.nome, status='Aprovada'
        )

        serializer = self.get_serializer(solicitacao)
        return Response(serializer.data, status=201)

    # Endpoint: POST /api/solicitacoes/aprovar/
    @action(detail=False, methods=['post'], url_path='aprovar')
    def aprovar_solicitacao(self, request):
        id_solicitacao = request.data.get('id_solicitacao')
        if not id_solicitacao:
            return Response({"mensagem": "ID da solicitação é obrigatório."}, status=400)
        try:
            solicitacao = Solicitacao.objects.get(id_solicitacao=id_solicitacao)
            solicitacao.status = 'Aprovada'
            solicitacao.save()
        except Solicitacao.DoesNotExist:
            return Response({"mensagem": "Solicitação não encontrada."}, status=404)
        return Response({"mensagem": "Solicitação aprovada com sucesso!"})
    
    # Endpoint: POST /api/solicitacoes/rejeitar/
    @action(detail=False, methods=['post'], url_path='rejeitar')
    def rejeitar_solicitacao(self, request):
        id_solicitacao = request.data.get('id_solicitacao')
        if not id_solicitacao:
            return Response({"mensagem": "ID da solicitação é obrigatório."}, status=400)
        try:
            solicitacao = Solicitacao.objects.get(id_solicitacao=id_solicitacao)
            solicitacao.status = 'Rejeitada'
            solicitacao.save()
        except Solicitacao.DoesNotExist:
            return Response({"mensagem": "Solicitação não encontrada."}, status=404)
        return Response({"mensagem": "Solicitação rejeitada com sucesso!"})

    # Endpoint: GET /api/solicitacoes/lista/
    @action(detail=False, methods=['get'], url_path='lista')
    def lista_solicitacoes(self, request):
        # pega todas as solicitações por usuário    
        pass
    
