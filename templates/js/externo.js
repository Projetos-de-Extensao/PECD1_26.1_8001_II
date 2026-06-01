document.addEventListener('DOMContentLoaded', () => {
  const categoria = document.getElementById('categoria');
  const form = document.getElementById('formExterno');
  const mensagem = document.getElementById('mensagem');
  const btnEnviar = document.getElementById('btnEnviar');
  const btnLimpar = document.getElementById('btnLimpar');
  const arquivo = document.getElementById('arquivo');
  const nomeArquivo = document.getElementById('nomeArquivo');

  function showMessage(text, type = 'success') {
    mensagem.textContent = text;
    mensagem.className = type;
    mensagem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearMessage() {
    mensagem.textContent = '';
    mensagem.className = '';
  }

  categoria.addEventListener('change', () => {
    clearMessage();
    if (categoria.value) {
      form.classList.remove('form-oculto');
      setTimeout(() => form.querySelector('input').focus(), 100);
    } else {
      form.classList.add('form-oculto');
    }
  });

  arquivo.addEventListener('change', () => {
    const f = arquivo.files[0];
    if (f) {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(2);
      nomeArquivo.textContent = `✓ ${f.name} (${sizeMB} MB)`;
    } else {
      nomeArquivo.textContent = '';
    }
  });

  btnLimpar.addEventListener('click', () => {
    form.reset();
    nomeArquivo.textContent = '';
    clearMessage();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const curso = form.curso.value.trim();
    const data = form.data.value;
    const duracao = parseFloat(form.duracao.value || 0);
    const f = arquivo.files[0];

    if (!curso || !data || !duracao || !f) {
      showMessage('Preencha todos os campos e anexe um PDF.', 'error');
      return;
    }

    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      showMessage('O arquivo precisa ser um PDF válido.', 'error');
      return;
    }

    if (f.size > 8 * 1024 * 1024) {
      showMessage('Arquivo muito grande (máximo 8MB).', 'error');
      return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    const fd = new FormData();
    fd.append('categoria', categoria.value);
    fd.append('curso', curso);
    fd.append('data', data);
    fd.append('duracao', duracao);
    fd.append('arquivo', f);

    try {
      const resp = await fetch('/solicitacao/externa', {
        method: 'POST',
        body: fd
      });

      if (resp.ok) {
        showMessage('✓ Solicitação enviada com sucesso!', 'success');
        form.reset();
        nomeArquivo.textContent = '';
        form.classList.add('form-oculto');
        categoria.value = '';
      } else {
        const txt = await resp.text().catch(() => resp.statusText);
        showMessage(`Erro: ${txt}`, 'error');
      }
    } catch (err) {
      showMessage('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar Solicitação';
    }
  });
});