from django.db import models

# Models do cadastro de usuários 
class Usuario(models.Model):
    matricula = models.CharField(max_length=20, primary_key=True)
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=100)
    curso = models.CharField(max_length=100)
    horas_computadas = models.FloatField(default=0)
    horas_totais = models.FloatField(default=0) 
    horas_internas = models.FloatField(default=0)
    horas_externas = models.FloatField(default=0)    
    ano_entrada = models.CharField(max_length=4, default='2026')
    periodo = models.CharField(max_length=20, default='2º Período')
    ativo = models.BooleanField(default=True)  # Para controle de usuários ativos/inativos


    def __str__(self):
        return self.nome

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
    arquivo = models.CharField(max_length=200, null=True, blank=True)
    status = models.CharField(max_length=20, default='Pendente')  # Pendente, Aprovada, Rejeitada
    observacao = models.TextField(null=True, blank=True)


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
    categoria = models.CharField(max_length=100, null=True, blank=True)
    data = models.DateField()
    hora = models.CharField(max_length=100)
    horas = models.FloatField()
    curso_alvo = models.CharField(max_length=150, null=True, blank=True)
    palestrante = models.CharField(max_length=150, null=True, blank=True)
    unidade = models.CharField(max_length=100, null=True, blank=True)
    ativo = models.BooleanField(default=True)  # Para controle de eventos ativos/inativos


    def __str__(self):
        return self.nome
