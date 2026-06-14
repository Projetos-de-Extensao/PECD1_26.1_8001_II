from django.conf import settings
from django.core import signing
from rest_framework import authentication, exceptions

from .models import Usuario


TOKEN_SALT = 'core.auth.usuario-token'
TOKEN_MAX_AGE = 30 * 60


def gerar_token(usuario):
    return signing.dumps(
        {
            'matricula': usuario.matricula,
            'is_funcionario': usuario.is_funcionario,
        },
        salt=TOKEN_SALT,
    )


def carregar_usuario_do_token(token):
    try:
        dados = signing.loads(token, salt=TOKEN_SALT, max_age=getattr(settings, 'AUTH_TOKEN_MAX_AGE', TOKEN_MAX_AGE))
    except signing.SignatureExpired as exc:
        raise exceptions.AuthenticationFailed('Sessao expirada. Faca login novamente.') from exc
    except signing.BadSignature as exc:
        raise exceptions.AuthenticationFailed('Token invalido.') from exc

    usuario = Usuario.objects.filter(matricula=dados.get('matricula'), ativo=True).first()
    if not usuario:
        raise exceptions.AuthenticationFailed('Usuario nao encontrado ou inativo.')
    return usuario


class BearerTokenAuthentication(authentication.BaseAuthentication):
    keyword = 'Bearer'

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).decode('utf-8')
        if not header:
            return None

        partes = header.split()
        if len(partes) != 2 or partes[0] != self.keyword:
            raise exceptions.AuthenticationFailed('Use Authorization: Bearer <token>.')

        usuario = carregar_usuario_do_token(partes[1])
        return (usuario, None)
