from datetime import date

from django.contrib.auth.hashers import check_password, make_password
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Categoria, Solicitacao, Usuario


class ApiSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.aluno = Usuario.objects.create(
            matricula='20260001',
            nome='Aluno Teste',
            email='aluno@ibmec.edu.br',
            senha=make_password('Senha123'),
            curso='Administracao',
        )
        self.outro_aluno = Usuario.objects.create(
            matricula='20260002',
            nome='Outro Aluno',
            email='outro@ibmec.edu.br',
            senha=make_password('Senha123'),
            curso='Administracao',
        )
        self.admin = Usuario.objects.create(
            matricula='FUNC-0001',
            nome='Admin Teste',
            email='admin@ibmec.br',
            senha=make_password('Senha123'),
            curso='Administrativo',
            is_funcionario=True,
        )
        self.categoria = Categoria.objects.create(
            atividade='Palestra',
            categoria='Eventos',
            tipo=False,
            horas=20,
        )

    def login(self, email, senha='Senha123'):
        resp = self.client.post('/api/usuarios/login/', {'email': email, 'senha': senha}, format='json')
        self.assertEqual(resp.status_code, 200)
        return resp.data['token']

    def autenticar(self, usuario):
        token = self.login(usuario.email)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_login_retorna_token_e_nao_expoe_senha(self):
        resp = self.client.post('/api/usuarios/login/', {'email': self.aluno.email, 'senha': 'Senha123'}, format='json')

        self.assertEqual(resp.status_code, 200)
        self.assertIn('token', resp.data)
        self.assertNotIn('senha', resp.data['usuario'])

    def test_criacao_de_usuario_salva_senha_com_hash(self):
        resp = self.client.post('/api/usuarios/criar/', {
            'matricula': '20260003',
            'nome': 'Novo Aluno',
            'email': 'novo@ibmec.edu.br',
            'senha': 'Senha123',
            'curso': 'Administracao',
        }, format='json')

        self.assertEqual(resp.status_code, 201)
        usuario = Usuario.objects.get(matricula='20260003')
        self.assertTrue(check_password('Senha123', usuario.senha))

    def test_aluno_nao_acessa_lista_administrativa(self):
        self.autenticar(self.aluno)

        resp = self.client.get('/api/usuarios/lista/')

        self.assertEqual(resp.status_code, 403)

    def test_aluno_cria_solicitacao_para_si_mesmo(self):
        self.autenticar(self.aluno)
        arquivo = SimpleUploadedFile('comprovante.pdf', b'%PDF-1.4 teste', content_type='application/pdf')

        resp = self.client.post('/api/solicitacoes/criar-externa/', {
            'categoria': self.categoria.id_categoria,
            'data': date.today().isoformat(),
            'horas': 2,
            'nome_atividade': 'Curso Externo',
            'arquivo': arquivo,
        }, format='multipart')

        self.assertEqual(resp.status_code, 201)
        solicitacao = Solicitacao.objects.get(id_solicitacao=resp.data['id_solicitacao'])
        self.assertEqual(solicitacao.aluno, self.aluno)
        self.assertEqual(solicitacao.status, 'Pendente')

    def test_upload_invalido_e_rejeitado(self):
        self.autenticar(self.aluno)
        arquivo = SimpleUploadedFile('malware.exe', b'teste', content_type='application/octet-stream')

        resp = self.client.post('/api/solicitacoes/criar-externa/', {
            'categoria': self.categoria.id_categoria,
            'data': date.today().isoformat(),
            'horas': 2,
            'nome_atividade': 'Curso Externo',
            'arquivo': arquivo,
        }, format='multipart')

        self.assertEqual(resp.status_code, 400)

    def test_funcionario_aprova_e_rejeita_solicitacao(self):
        solicitacao = Solicitacao.objects.create(
            aluno=self.aluno,
            categoria=self.categoria,
            data=date.today(),
            horas=2,
            tipo='Externa',
            nome_atividade='Curso Externo',
        )
        self.autenticar(self.admin)

        resp_aprovar = self.client.post('/api/solicitacoes/aprovar/', {'id_solicitacao': solicitacao.id_solicitacao}, format='json')
        solicitacao.refresh_from_db()

        self.assertEqual(resp_aprovar.status_code, 200)
        self.assertEqual(solicitacao.status, 'Aprovada')
        self.assertEqual(solicitacao.avaliado_por, self.admin)

        resp_rejeitar = self.client.post('/api/solicitacoes/rejeitar/', {
            'id_solicitacao': solicitacao.id_solicitacao,
            'motivo': 'Comprovante ilegivel',
        }, format='json')
        solicitacao.refresh_from_db()

        self.assertEqual(resp_rejeitar.status_code, 200)
        self.assertEqual(solicitacao.status, 'Rejeitada')
        self.assertEqual(solicitacao.observacao, 'Comprovante ilegivel')

    def test_get_horas_totais_nao_salva_totais_no_usuario(self):
        Solicitacao.objects.create(
            aluno=self.aluno,
            categoria=self.categoria,
            data=date.today(),
            horas=4,
            tipo='Externa',
            nome_atividade='Curso Externo',
            status='Aprovada',
        )
        self.autenticar(self.aluno)

        resp = self.client.get('/api/usuarios/horas-totais/')
        self.aluno.refresh_from_db()

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['horas_totais'], 4)
        self.assertEqual(self.aluno.horas_totais, 0)
