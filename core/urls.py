from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, CategoriaViewSet, SolicitacaoViewSet, EventosViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'eventos', EventosViewSet)
router.register(r'solicitacoes', SolicitacaoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]