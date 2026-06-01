from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, CategoriaViewSet, AtividadeViewSet, login_view

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'atividades', AtividadeViewSet)

urlpatterns = router.urls + [
    path('login/', login_view),
]