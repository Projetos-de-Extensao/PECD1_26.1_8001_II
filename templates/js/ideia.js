document.addEventListener('DOMContentLoaded', () => {
  const btnsNav = document.querySelectorAll('.btn-nav');
  const formularios = document.querySelectorAll('.formulario');

  // Navegação entre formulários
  btnsNav.forEach(btn => {
    btn.addEventListener('click', () => {
      const formName = btn.dataset.form;

      btnsNav.forEach(b => b.classList.remove('ativo'));
      formularios.forEach(f => f.classList.remove('ativo'));

      btn.classList.add('ativo');
      document.getElementById(`form-${formName}`).classList.add('ativo');
    });
  });

  // Filtros Histórico
  const abasFiltro = document.querySelectorAll('.aba-btn');
  abasFiltro.forEach(aba => {
    aba.addEventListener('click', () => {
      abasFiltro.forEach(a => a.classList.remove('aba-ativo'));
      aba.classList.add('aba-ativo');
    });
  });

  // Formulário Externo
  const categoria = document.getElementById('categoria');
  const formExterno = document.getElementById('formExterno');
  const btnLimpar = document.getElementById('btnLimpar');

  categoria?.addEventListener('change', () => {
    if (categoria.value) {
      formExterno.classList.remove('form-oculto');
    } else {
      formExterno.classList.add('form-oculto');
    }
  });

  btnLimpar?.addEventListener('click', () => {
    formExterno.reset();
    categoria.value = '';
    formExterno.classList.add('form-oculto');
  });

  // HAMBURGER MENU - VERSÃO CORRIGIDA
  const hamburger = document.querySelector('.hamburger');
  const menuPrincipal = document.querySelector('.menu-principal');

  console.log('Hamburger:', hamburger); // Debug
  console.log('Menu:', menuPrincipal); // Debug

  if (hamburger && menuPrincipal) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Clique no hamburger'); // Debug
      hamburger.classList.toggle('ativo');
      menuPrincipal.classList.toggle('aberto');
    });

    // Fechar menu ao clicar em um link
    const links = menuPrincipal.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('ativo');
        menuPrincipal.classList.remove('aberto');
      });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-container')) {
        hamburger.classList.remove('ativo');
        menuPrincipal.classList.remove('aberto');
      }
    });
  }
});