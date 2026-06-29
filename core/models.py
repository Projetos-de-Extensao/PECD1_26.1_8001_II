from django.db import models
from django.utils import timezone

# Models do cadastro de usuários 
class Usuario(models.Model):
    matricula = models.CharField(max_length=20, primary_key=True)
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=128)
    curso = models.CharField(max_length=100)
    horas_totais = models.FloatField(default=0) 
    horas_internas = models.FloatField(default=0)
    horas_externas = models.FloatField(default=0)    
    ano_entrada = models.CharField(max_length=4, default='2026')
    periodo = models.CharField(max_length=20, default='2º Período')
    ativo = models.BooleanField(default=True)  # Para controle de usuários ativos/inativos
    is_funcionario = models.BooleanField(default=False)  # True para Funcionários/Administradores


    def __str__(self):
        return self.nome

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

# Models das socilitações de atividades complementares
class Solicitacao(models.Model):
    id_solicitacao = models.AutoField(primary_key=True)
    aluno = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='solicitacoes')
    categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE, related_name='solicitacoes')
    evento = models.ForeignKey('Eventos', on_delete=models.SET_NULL, null=True, blank=True, related_name='solicitacoes')
    data = models.DateField()
    horas = models.FloatField()
    tipo = models.CharField(max_length=20)  # Interna ou Externa
    nome_atividade = models.CharField(max_length=100)
    arquivo = models.FileField(upload_to='comprovantes/', null=True, blank=True)
    status = models.CharField(max_length=30, default='Pendente')  # Pendente, Aprovada, Rejeitada, Ajuste solicitado
    observacao = models.TextField(null=True, blank=True)
    avaliado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='solicitacoes_avaliadas')
    avaliado_em = models.DateTimeField(null=True, blank=True)

    def registrar_decisao(self, status, avaliador=None, observacao=None):
        self.status = status
        self.avaliado_por = avaliador
        self.avaliado_em = timezone.now()
        if observacao is not None:
            self.observacao = observacao
        self.save(update_fields=['status', 'avaliado_por', 'avaliado_em', 'observacao'])


#Models das categorias de atividades complementares
class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    atividade = models.CharField(max_length=100)
    categoria = models.CharField(max_length=100)
    tipo = models.BooleanField(default=False)  # True interna e False externa
    horas = models.FloatField()
    ativo = models.BooleanField(default=True)  # Para controle de categorias ativas/inativas

    def __str__(self):
        return self.atividade

# Models dos Eventos Institucionais (Mural de Eventos)
class Eventos(models.Model):
    id_evento = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=200)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name='eventos')
    data = models.DateField()
    hora = models.CharField(max_length=100)
    horas = models.FloatField()
    curso_alvo = models.CharField(max_length=150, null=True, blank=True)
    palestrante = models.CharField(max_length=150, null=True, blank=True)
    unidade = models.CharField(max_length=100, null=True, blank=True)
    local = models.CharField(max_length=150, null=True, blank=True)
    ativo = models.BooleanField(default=True)  # Para controle de eventos ativos/inativos


    def __str__(self):
        return self.nome
