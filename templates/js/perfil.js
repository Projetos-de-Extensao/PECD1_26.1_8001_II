document.addEventListener('DOMContentLoaded', () => {
  const btnMudarSenha = document.getElementById('btnMudarSenha');
  const modal = document.getElementById('modalSenha');
  const btnFecharModal = document.getElementById('btnFecharModal');
  const btnCancelarModal = document.getElementById('btnCancelarModal');
  const formSenha = document.getElementById('formSenha');
  const msgModalSenha = document.getElementById('msgModalSenha');

  // Abrir modal
  btnMudarSenha.addEventListener('click', () => {
    modal.classList.add('ativo');
    formSenha.reset();
    msgModalSenha.textContent = '';
    msgModalSenha.className = 'msg-modal';
  });

  // Fechar modal
  const fecharModal = () => {
    modal.classList.remove('ativo');
    formSenha.reset();
    msgModalSenha.textContent = '';
    msgModalSenha.className = 'msg-modal';
  };

  btnFecharModal.addEventListener('click', fecharModal);
  btnCancelarModal.addEventListener('click', fecharModal);

  // Fechar ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      fecharModal();
    }
  });

  // Submeter formulário de senha
  formSenha.addEventListener('submit', async (e) => {
    e.preventDefault();

    const senhaAtual = document.getElementById('senhaAtual').value.trim();
    const senhaNova = document.getElementById('senhaNova').value.trim();
    const senhaConfirm = document.getElementById('senhaConfirm').value.trim();

    // Validar campos vazios
    if (!senhaAtual || !senhaNova || !senhaConfirm) {
      mostrarMensagem('Por favor, preencha todos os campos.', 'error');
      return;
    }

    // Validar comprimento mínimo
    if (senhaNova.length < 8) {
      mostrarMensagem('A nova senha deve ter no mínimo 8 caracteres.', 'error');
      return;
    }

    // Validar requisitos
    const temMaiuscula = /[A-Z]/.test(senhaNova);
    const temNumero = /[0-9]/.test(senhaNova);

    if (!temMaiuscula || !temNumero) {
      mostrarMensagem('A senha deve conter pelo menos 1 maiúscula e 1 número.', 'error');
      return;
    }

    // Validar confirmação
    if (senhaNova !== senhaConfirm) {
      mostrarMensagem('As senhas não conferem.', 'error');
      return;
    }

    // Validar se é diferente da atual
    if (senhaAtual === senhaNova) {
      mostrarMensagem('A nova senha deve ser diferente da atual.', 'error');
      return;
    }

    // Enviar para o servidor
    try {
      const response = await fetch('/api/perfil/mudar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senhaAtual,
          senhaNova
        })
      });

      if (response.ok) {
        mostrarMensagem('✓ Senha alterada com sucesso!', 'success');
        setTimeout(() => {
          fecharModal();
        }, 1500);
      } else {
        const data = await response.json();
        mostrarMensagem(data.mensagem || 'Erro ao alterar senha.', 'error');
      }
    } catch (err) {
      mostrarMensagem('Erro de conexão. Tente novamente.', 'error');
    }
  });

  function mostrarMensagem(texto, tipo) {
    msgModalSenha.textContent = texto;
    msgModalSenha.className = `msg-modal ${tipo}`;
  }

  // HAMBURGER MENU
  const hamburger = document.querySelector('.hamburger');
  const menuPrincipal = document.querySelector('.menu-principal');

  if (hamburger && menuPrincipal) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('ativo');
      menuPrincipal.classList.toggle('aberto');
    });

    const links = menuPrincipal.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('ativo');
        menuPrincipal.classList.remove('aberto');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-container')) {
        hamburger.classList.remove('ativo');
        menuPrincipal.classList.remove('aberto');
      }
    });
  }

  // SUBMENU PERFIL - VERSÃO CORRIGIDA
  const btnPerfil = document.querySelector('.menu-perfil-botao');
  const submenuPerfil = document.querySelector('.submenu-perfil');

  if (btnPerfil && submenuPerfil) {
    // Abrir/fechar ao clicar
    btnPerfil.addEventListener('click', (e) => {
      e.stopPropagation();
      submenuPerfil.classList.toggle('aberto');
      console.log('Clique no botão Perfil');
    });

    // Fechar ao clicar em um link do submenu
    const linksSubmenu = submenuPerfil.querySelectorAll('a');
    linksSubmenu.forEach(link => {
      link.addEventListener('click', () => {
        submenuPerfil.classList.remove('aberto');
      });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.menu-com-submenu')) {
        submenuPerfil.classList.remove('aberto');
      }
    });
  }

  // Logout
  const btnLogout = document.querySelector('a[href="#logout"]');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Tem certeza que deseja sair?')) {
        window.location.href = '/logout';
      }
    });
  }
});