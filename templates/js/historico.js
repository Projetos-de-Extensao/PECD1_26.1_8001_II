document.addEventListener('DOMContentLoaded', () => {
  // Dados de exemplo - substitua pela API real
  const solicitacoes = [
    {
      id: 1,
      tipo: 'interna',
      nome: 'Workshop: Design Thinking',
      data: '15/04/2026',
      horas: 4,
      status: 'aprovado'
    },
    {
      id: 2,
      tipo: 'externa',
      nome: 'Palestra: Inovação Disruptiva',
      data: '10/04/2026',
      horas: 2,
      status: 'aprovado'
    },
    {
      id: 3,
      tipo: 'interna',
      nome: 'Curso: Python Avançado',
      data: '08/04/2026',
      horas: 8,
      status: 'aprovado'
    },
    {
      id: 4,
      tipo: 'externa',
      nome: 'Seminário: Empreendedorismo',
      data: '05/04/2026',
      horas: 3,
      status: 'progresso'
    },
    {
      id: 5,
      tipo: 'interna',
      nome: 'Mentoria: Liderança',
      data: '02/04/2026',
      horas: 2,
      status: 'recusado'
    },
    {
      id: 6,
      tipo: 'externa',
      nome: 'Congresso: Tecnologia e Sociedade',
      data: '28/03/2026',
      horas: 6,
      status: 'progresso'
    }
  ];

  const abasBtns = document.querySelectorAll('.aba-btn');
  const tabelaBody = document.getElementById('tabelaBody');
  const msgVazio = document.getElementById('msgVazio');
  let filtroAtual = 'todos';

  // Contar solicitações por status
  function atualizarContadores() {
    const countTodos = solicitacoes.length;
    const countAprovado = solicitacoes.filter(s => s.status === 'aprovado').length;
    const countProgresso = solicitacoes.filter(s => s.status === 'progresso').length;
    const countRecusado = solicitacoes.filter(s => s.status === 'recusado').length;

    document.getElementById('countTodos').textContent = countTodos;
    document.getElementById('countAprovado').textContent = countAprovado;
    document.getElementById('countProgresso').textContent = countProgresso;
    document.getElementById('countRecusado').textContent = countRecusado;
  }

  // Renderizar tabela
  function renderizarTabela(filtro) {
    let dados = solicitacoes;
    if (filtro !== 'todos') {
      dados = solicitacoes.filter(s => s.status === filtro);
    }

    tabelaBody.innerHTML = '';

    if (dados.length === 0) {
      msgVazio.style.display = 'block';
      return;
    }

    msgVazio.style.display = 'none';

    dados.forEach(s => {
      const linha = document.createElement('tr');
      
      const iconStatus = {
        aprovado: '✓',
        progresso: '⏳',
        recusado: '✗'
      };

      linha.innerHTML = `
        <td>
          <span class="tipo-atividade tipo-${s.tipo}">
            ${s.tipo === 'interna' ? 'Interna' : 'Externa'}
          </span>
        </td>
        <td class="nome-atividade">${s.nome}</td>
        <td class="data-atividade">${s.data}</td>
        <td class="horas-atividade">${s.horas}h</td>
        <td>
          <span class="status-badge status-${s.status}">
            <span>${iconStatus[s.status]}</span>
            <span>${s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span>
          </span>
        </td>
        <td class="coluna-acoes">
          <button class="btn-acao" title="Ver detalhes">
            👁️ Ver
          </button>
        </td>
      `;

      tabelaBody.appendChild(linha);
    });
  }

  // Event listeners nas abas
  abasBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      abasBtns.forEach(b => b.classList.remove('aba-ativo'));
      btn.classList.add('aba-ativo');
      filtroAtual = btn.dataset.filtro;
      renderizarTabela(filtroAtual);
    });
  });

  // Inicializar
  atualizarContadores();
  renderizarTabela('todos');
});