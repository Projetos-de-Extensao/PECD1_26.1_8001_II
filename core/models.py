from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=100)

    def __str__(self):
        return self.nome


class Categoria(models.Model):
    atividade = models.CharField(max_length=100)
    natureza = models.CharField(max_length=100)  # Interna ou externa

    def __str__(self):
        return self.atividade


class Atividade(models.Model):
    aluno = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='atividades')
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='atividades')
    data = models.DateField()
    horas = models.FloatField()
    nome_atividade = models.CharField(max_length=100)
    arquivo = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f'{self.nome_atividade} - {self.aluno.nome}'