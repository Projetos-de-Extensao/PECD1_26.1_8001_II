from django.db.models import Sum
from rest_framework.exceptions import ValidationError

from .models import Solicitacao


STATUS_PENDENTE = 'Pendente'
STATUS_APROVADA = 'Aprovada'
STATUS_REJEITADA = 'Rejeitada'
STATUS_AJUSTE = 'Ajuste solicitado'

STATUS_VALIDOS = {
    STATUS_PENDENTE,
    STATUS_APROVADA,
    STATUS_REJEITADA,
    STATUS_AJUSTE,
}

MAX_UPLOAD_BYTES = 5 * 1024 * 1024
EXTENSOES_PERMITIDAS = {'.pdf', '.png', '.jpg', '.jpeg'}
MIME_PERMITIDOS = {'application/pdf', 'image/png', 'image/jpeg'}


def metas_do_curso(curso):
    curso_nome = (curso or '').lower()

    cursos_240 = {
        'administração',
        'análise e desenvolvimento de sistemas',
        'arquitetura e urbanismo',
        'ciência de dados e inteligência artificial',
        'engenharia de software',
        'Ciências Contábeis',
        'Ciências Econômicas',
        'Comunicação Social - Publicidade e Propaganda',
        'Direito',
        'Engenharia da Computação',
        'Engenharia de Produção',
        'Engenharia de Software',
        'Relações Internacionais',

    }

    if curso_nome in cursos_240:
        return 240, 120, 120

    if curso_nome == 'direito':
        return 300, 150, 150

    return 120, 60, 60
def totais_aprovados(usuario):
    agregados = Solicitacao.objects.filter(aluno=usuario, status=STATUS_APROVADA).values('tipo').annotate(total=Sum('horas'))
    por_tipo = {item['tipo']: item['total'] or 0 for item in agregados}
    internas = por_tipo.get('Interna', 0)
    externas = por_tipo.get('Externa', 0)
    return internas + externas, internas, externas


def horas_usadas_na_categoria(usuario, categoria, ignorar_id=None):
    qs = Solicitacao.objects.filter(aluno=usuario, categoria=categoria, status=STATUS_APROVADA)
    if ignorar_id:
        qs = qs.exclude(id_solicitacao=ignorar_id)
    return qs.aggregate(total=Sum('horas'))['total'] or 0


def validar_limite_categoria(usuario, categoria, horas, ignorar_id=None):
    usadas = horas_usadas_na_categoria(usuario, categoria, ignorar_id=ignorar_id)
    if usadas + float(horas or 0) > categoria.horas:
        raise ValidationError({
            'horas': f'Limite da categoria excedido. Disponivel: {max(categoria.horas - usadas, 0)}h.'
        })


def aprovar_solicitacao(solicitacao, avaliador):
    validar_limite_categoria(solicitacao.aluno, solicitacao.categoria, solicitacao.horas, solicitacao.id_solicitacao)
    solicitacao.registrar_decisao(STATUS_APROVADA, avaliador=avaliador)
    return solicitacao


def rejeitar_solicitacao(solicitacao, avaliador, motivo):
    if not motivo:
        raise ValidationError({'motivo': 'Motivo da rejeicao e obrigatorio.'})
    solicitacao.registrar_decisao(STATUS_REJEITADA, avaliador=avaliador, observacao=motivo)
    return solicitacao


def solicitar_ajuste(solicitacao, avaliador, motivo):
    if not motivo:
        raise ValidationError({'motivo': 'Motivo do ajuste e obrigatorio.'})
    solicitacao.registrar_decisao(STATUS_AJUSTE, avaliador=avaliador, observacao=motivo)
    return solicitacao


def validar_arquivo_comprovante(arquivo):
    if not arquivo:
        return

    nome = arquivo.name.lower()
    if not any(nome.endswith(ext) for ext in EXTENSOES_PERMITIDAS):
        raise ValidationError({'arquivo': 'Formato invalido. Use PDF, PNG, JPG ou JPEG.'})

    content_type = getattr(arquivo, 'content_type', None)
    if content_type and content_type not in MIME_PERMITIDOS:
        raise ValidationError({'arquivo': 'MIME type invalido para comprovante.'})

    if arquivo.size > MAX_UPLOAD_BYTES:
        raise ValidationError({'arquivo': 'Arquivo excede o limite de 5MB.'})
