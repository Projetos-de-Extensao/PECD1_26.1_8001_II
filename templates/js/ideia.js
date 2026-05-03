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
});