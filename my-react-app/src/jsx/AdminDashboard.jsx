import React, { useState, useEffect } from 'react';
import '../css/index.css';
import '../css/adminDashboard.css';
import { apiFetch, apiJson } from '../api';

export default function AdminDashboard() {
  // Controle de qual aba está ativa na tela
  const [abaAtiva, setAbaAtiva] = useState('solicitacoes');
  
  // Estados para armazenar os dados
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [metricas, setMetricas] = useState({});
  const [atividades, setAtividades] = useState([]);
  const [novaAtividade, setNovaAtividade] = useState({ categoria: '', nome: '', tipo: 'Interna', horas: '' });

  // Estados para Criação de Novo Evento
  const [mostrarFormEvento, setMostrarFormEvento] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    nome: '',
    categoria: '',
    data: '',
    hora: '',
    horas: '',
    cursoAlvo: '',
    palestrante: '',
    unidade: '',
    tipo: 'Interno'
  });

  // Estados dos Filtros da Tabela de Solicitações
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroAluno, setFiltroAluno] = useState('');

  // Estados dos Filtros de Alunos e Eventos
  const [filtroBuscaAluno, setFiltroBuscaAluno] = useState('');
  const [filtroNomeEvento, setFiltroNomeEvento] = useState('');
  const [filtroTipoEvento, setFiltroTipoEvento] = useState('');

  // Estado do Modal de Comprovante
  const [comprovanteSelecionado, setComprovanteSelecionado] = useState(null);
  
  // Estado do Modal de QR Code
  const [qrCodeSelecionado, setQrCodeSelecionado] = useState(null);

  // Simulando a busca de dados do banco de dados ao carregar a página
  useEffect(() => {

    // Busca real de Tipos de Atividades na API do Django
    async function buscarCategorias() {
      try {
        const dados = await apiJson('/api/categorias/lista/');
        {
          
          // Traduzimos o JSON do Banco para o formato que a Tabela e o Select usam
          const formatado = dados.map(item => ({
            id: item.id_categoria,
            categoria: item.categoria,
            nome: item.atividade, // O Django chama de 'atividade' e o React chama de 'nome'
            tipo: item.tipo ? 'Interna' : 'Externa', // True = Interna, False = Externa
            horas: item.horas
          }));
          
          setAtividades(formatado);
        }
      } catch (err) {
        console.error('Erro ao buscar categorias do banco de dados:', err);
      }
    }

    // Busca real de Eventos na API do Django
    async function buscarEventos() {
      try {
        const dados = await apiJson('/api/eventos/lista/');
        {
          const formatado = dados.map(item => ({
            id: item.id_evento,
            nome: item.nome,
            // Formata a data AAAA-MM-DD para DD/MM/AAAA na tela
            data: item.data ? item.data.split('-').reverse().join('/') : '',
            hora: item.hora,
            horas: item.horas,
            tipo: 'Interno',
            categoria: item.categoria_nome || item.categoria,
            cursoAlvo: item.curso_alvo,
            palestrante: item.palestrante,
            unidade: item.unidade
          }));
          setEventos(formatado);
        }
      } catch (err) {
        console.error('Erro ao buscar eventos do banco de dados:', err);
      }
    }

    // Busca real de Alunos na API do Django
    async function buscarAlunos() {
      try {
        const dados = await apiJson('/api/usuarios/lista/');
        {
          const formatado = dados.map(item => {
            // Replica a lógica de metas do backend baseada no curso
            const cursoNome = (item.curso || '').toLowerCase();
            let metaTotal = 120, metaInt = 60, metaExt = 60;
            if (cursoNome.includes('engenharia') || cursoNome.includes('computação') || cursoNome.includes('sistemas')) {
              metaTotal = 240; metaInt = 120; metaExt = 120;
            } else if (cursoNome.includes('direito')) {
              metaTotal = 300; metaInt = 150; metaExt = 150;
            }
            
            return {
              matricula: item.matricula,
              nome: item.nome,
              curso: item.curso,
              horasCumpridas: item.horas_totais || 0,
              meta: metaTotal,
              internas: item.horas_internas || 0,
              metaInternas: metaInt,
              externas: item.horas_externas || 0,
              metaExternas: metaExt
            };
          });
          setAlunos(formatado);
        }
      } catch (err) {
        console.error('Erro ao buscar alunos do banco de dados:', err);
      }
    }
    
    // Busca real da Fila de Validação na API do Django
    async function buscarSolicitacoes() {
      try {
        // Utilizamos a rota padrão /api/solicitacoes/ porque ela retorna TODAS as requisições pro Admin.
        // (A rota /api/solicitacoes/lista/ devolveria apenas as da matrícula logada).
        const dados = await apiJson('/api/solicitacoes/admin/');
        {
          const formatado = dados.map(item => {
            // Traduz os status do Backend pro que a Interface Gráfica espera
            let statusFormatado = 'Pendente';
            if (item.status === 'Aprovada') statusFormatado = 'Aprovado';
            if (item.status === 'Rejeitada') statusFormatado = 'Recusado';
            if (item.status === 'Ajuste solicitado') statusFormatado = 'Ajuste solicitado';

            return {
              id: item.id_solicitacao,
              aluno: item.aluno_nome || item.aluno || 'Aluno', // O django retorna a PK (Matrícula) como ForeignKey
              matricula: item.aluno, 
              categoria: item.categoria_nome || item.categoria || 'Geral',
              tipo: item.tipo,
              atividade: item.nome_atividade,
              horas: item.horas,
              status: statusFormatado,
              motivo: item.observacao,
              arquivo: item.arquivo ? { url: item.arquivo, nome: 'comprovante.pdf' } : null
            };
          });
          setSolicitacoes(formatado.reverse()); // As solicitações mais recentes aparecem primeiro
        }
      } catch (err) {
        console.error('Erro ao buscar fila de solicitações:', err);
      }
    }

    buscarCategorias();
    buscarEventos();
    buscarAlunos();
    buscarSolicitacoes();
  }, []);

  // Recalcula as métricas dinamicamente no JS sempre que as listas mudarem
  useEffect(() => {
    const totalAlunos = alunos.length;
    const totalSolicitacoes = solicitacoes.length;
    const atendidas = solicitacoes.filter(s => s.status !== 'Pendente').length;
    const aguardando = solicitacoes.filter(s => s.status === 'Pendente').length;
    const internas = solicitacoes.filter(s => s.tipo === 'Interna').length;
    const externas = solicitacoes.filter(s => s.tipo === 'Externa').length;

    setMetricas({
      totalAlunos, totalSolicitacoes, atendidas, aguardando, internas, externas
    });
  }, [alunos, solicitacoes]);

  // Funções para lidar com as ações do avaliador
  async function handleAprovar(id) {
    try {
      const resp = await apiFetch('/api/solicitacoes/aprovar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_solicitacao: id })
      });
      if (resp.ok) {
        setSolicitacoes(prev => prev.map(s => s.id === id ? { ...s, status: 'Aprovado' } : s));
      } else {
        alert('Erro ao aprovar solicitação no servidor.');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRecusar(id) {
    const motivo = prompt('Qual o motivo da recusa?');
    if (motivo) {
      try {
        const resp = await apiFetch('/api/solicitacoes/rejeitar/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_solicitacao: id, motivo })
        });
        if (resp.ok) {
          setSolicitacoes(prev => prev.map(s => s.id === id ? { ...s, status: 'Recusado', motivo } : s));
        } else {
          alert('Erro ao recusar solicitação no servidor.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  function handleRemoverEvento(id) {
    if(window.confirm('Tem certeza que deseja remover este evento?')) {
      setEventos(prev => prev.filter(e => e.id !== id));
    }
  }

  // Funções para gerenciar Tipos de Atividades
  async function handleAdicionarAtividade(e) {
    e.preventDefault();
    if (!novaAtividade.nome || !novaAtividade.categoria || !novaAtividade.horas) {
      alert('Preencha os campos obrigatórios (Categoria, Nome e Horas).');
      return;
    }

    // Montando o pacote JSON exatamente como configuramos na view "criar_categoria" do Django
    const payload = {
      atividade: novaAtividade.nome,
      categoria: novaAtividade.categoria,
      tipo: novaAtividade.tipo === 'Interna', // Transforma a string em Booleano (True/False)
      horas: parseFloat(novaAtividade.horas)
    };

    try {
      const resp = await apiFetch('/api/categorias/criar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        const data = await resp.json();
        
        // Adiciona a nova categoria na tabela instantaneamente após a resposta do servidor
        setAtividades(prev => [...prev, {
          id: data.id_categoria,
          categoria: data.categoria,
          nome: data.atividade,
          tipo: data.tipo ? 'Interna' : 'Externa',
          horas: data.horas
        }]);
        
        setNovaAtividade({ categoria: '', nome: '', tipo: 'Interna', horas: '' });
      } else {
        alert('Erro ao salvar a categoria no banco de dados.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com a API.');
    }
  }

  async function handleRemoverAtividade(id) {
    if (window.confirm('Tem certeza que deseja remover este tipo de atividade?')) {
      try {
        const resp = await apiFetch(`/api/categorias/${id}/`, {
          method: 'DELETE'
        });
        
        if (resp.ok || resp.status === 204) {
          setAtividades(prev => prev.filter(a => a.id !== id));
        } else {
          alert('Erro ao excluir do banco de dados.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  // Função para criar o evento a partir do formulário estendido
  async function handleAdicionarEvento(e) {
    e.preventDefault();
    if (!novoEvento.nome || !novoEvento.categoria || !novoEvento.data || !novoEvento.hora || !novoEvento.horas) {
      alert('Preencha os campos obrigatórios (Nome, Categoria, Data, Horário e Horas).');
      return;
    }
    
    try {
      const resp = await apiFetch('/api/eventos/criar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEvento)
      });

      if (resp.ok) {
        const data = await resp.json();

        // Encontra o nome da categoria para exibir imediatamente na tabela
        const catSelecionada = atividades.find(a => String(a.id) === String(novoEvento.categoria));
        
        setEventos(prev => [{
          id: data.id_evento, ...novoEvento, categoria: catSelecionada ? catSelecionada.nome : '', data: novoEvento.data.split('-').reverse().join('/')
        }, ...prev]);
        
        // Limpa o formulário e esconde
        setNovoEvento({ nome: '', categoria: '', data: '', hora: '', horas: '', cursoAlvo: '', palestrante: '', unidade: '', tipo: 'Interno' });
        setMostrarFormEvento(false);
      } else {
        alert('Erro ao salvar evento no banco de dados.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com a API ao criar evento.');
    }
  }

  // Aplicação dos Filtros na Lista de Solicitações
  const solicitacoesFiltradas = solicitacoes.filter(sol => {
    const matchCategoria = filtroCategoria === '' || sol.categoria === filtroCategoria;
    const matchTipo = filtroTipo === '' || sol.tipo === filtroTipo;
    const matchAluno = filtroAluno === '' || 
                       sol.aluno.toLowerCase().includes(filtroAluno.toLowerCase()) || 
                       sol.matricula.includes(filtroAluno);
    return matchCategoria && matchTipo && matchAluno;
  });

  // Aplicação dos Filtros na Base de Alunos
  const alunosFiltrados = alunos.filter(aluno => {
    const termo = filtroBuscaAluno.toLowerCase();
    return filtroBuscaAluno === '' || 
           aluno.nome.toLowerCase().includes(termo) || 
           aluno.matricula.includes(termo);
  });

  // Aplicação dos Filtros nos Eventos
  const eventosFiltrados = eventos.filter(evento => {
    const matchNome = filtroNomeEvento === '' || evento.nome.toLowerCase().includes(filtroNomeEvento.toLowerCase());
    const matchTipo = filtroTipoEvento === '' || evento.tipo === filtroTipoEvento;
    return matchNome && matchTipo;
  });

  return (
    <main className="container-principal container-fluido">
      <section className="admin-dashboard">
        <div className="admin-header">
          <h1 className="titulo-admin">Painel Gerencial Administrativo</h1>
          <p className="subtitulo-admin">Visão consolidada e controle de processos institucionais.</p>
        </div>

        {/* DASHBOARD PERSISTENTE NO TOPO */}
        <div className="dashboard-topo">
          <div className="grid-metricas">
            <div className="card-metrica">
              <span className="titulo-metrica">Total de Alunos</span>
              <span className="valor-metrica">{metricas.totalAlunos}</span>
            </div>
            <div className="card-metrica">
              <span className="titulo-metrica">Total de Solicitações</span>
              <span className="valor-metrica">{metricas.totalSolicitacoes}</span>
            </div>
            <div className="card-metrica" style={{ borderLeftColor: '#1f8b4c' }}>
              <span className="titulo-metrica">Atendidas</span>
              <span className="valor-metrica" style={{ color: '#1f8b4c' }}>{metricas.atendidas}</span>
            </div>
            <div className="card-metrica" style={{ borderLeftColor: '#F5AC00' }}>
              <span className="titulo-metrica">Aguardando Avaliação</span>
              <span className="valor-metrica" style={{ color: '#F5AC00' }}>{metricas.aguardando}</span>
            </div>
            <div className="card-metrica" style={{ borderLeftColor: '#0056b3' }}>
              <span className="titulo-metrica">Reg. Internos (QR)</span>
              <span className="valor-metrica" style={{ color: '#0056b3' }}>{metricas.internas}</span>
            </div>
            <div className="card-metrica" style={{ borderLeftColor: '#6f42c1' }}>
              <span className="titulo-metrica">Reg. Externos</span>
              <span className="valor-metrica" style={{ color: '#6f42c1' }}>{metricas.externas}</span>
            </div>
          </div>
        </div>

        {/* LAYOUT FIXO DESKTOP (MENU LATERAL + CONTEÚDO) */}
        <div className="admin-painel-inferior">
          
          {/* MENU LATERAL VERTICAL */}
          <div className="admin-menu-lateral">
            <button className={`menu-btn ${abaAtiva === 'alunos' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('alunos')}>
              👥 Base de Alunos
            </button>
            <button className={`menu-btn ${abaAtiva === 'solicitacoes' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('solicitacoes')}>
              📋 Fila de Validação
            </button>
            <button className={`menu-btn ${abaAtiva === 'atividades' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('atividades')}>
              ⚙️ Tipos de Atividades
            </button>
            <button className={`menu-btn ${abaAtiva === 'eventos' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('eventos')}>
              📅 Eventos 
            </button>
          </div>

          {/* ÁREA DE CONTEÚDO FIXA */}
          <div className="admin-conteudo-lateral">
            
            {/* CONTEÚDO: ALUNOS */}
            {abaAtiva === 'alunos' && (
              <div className="conteudo-animado">
                <div className="header-eventos">
                  <h2 className="titulo-secao-admin">Gestão Acadêmica</h2>
                  <button className="btn btn-secundario">📥 Exportar Relatório</button>
                </div>
                
                {/* BARRA DE FILTROS ALUNOS */}
                <div className="form-admin-inline" style={{ marginBottom: '1.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Pesquisar por nome ou matrícula..." 
                    value={filtroBuscaAluno}
                    onChange={(e) => setFiltroBuscaAluno(e.target.value)}
                  />
                </div>

                <div className="tabela-wrapper">
                  <table className="tabela-admin">
                    <thead>
                      <tr>
                        <th>Matrícula</th>
                        <th>Nome do Aluno</th>
                        <th>Curso</th>
                        <th>Internas</th>
                        <th>Externas</th>
                        <th>Progresso AAC</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alunosFiltrados.map(aluno => {
                        const percentual = Math.min(100, Math.round((aluno.horasCumpridas / aluno.meta) * 100));
                        const pctInternas = Math.min(100, Math.round((aluno.internas / aluno.metaInternas) * 100));
                        const pctExternas = Math.min(100, Math.round((aluno.externas / aluno.metaExternas) * 100));
                        return (
                          <tr key={aluno.matricula}>
                            <td data-label="Matrícula"><strong>{aluno.matricula}</strong></td>
                            <td data-label="Nome do Aluno">{aluno.nome}</td>
                            <td data-label="Curso">{aluno.curso}</td>
                            <td data-label="Internas">
                              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: pctInternas === 100 ? '#1f8b4c' : '#F5AC00' }}>
                                {aluno.internas}/{aluno.metaInternas}h
                              </span>
                            </td>
                            <td data-label="Externas">
                              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: pctExternas === 100 ? '#1f8b4c' : '#6366f1' }}>
                                {aluno.externas}/{aluno.metaExternas}h
                              </span>
                            </td>
                            <td data-label="Progresso AAC">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <div style={{ width: '80px', background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${percentual}%`, background: percentual === 100 ? '#1f8b4c' : 'var(--cor-secundaria)', height: '100%' }}></div>
                                </div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{aluno.horasCumpridas}/{aluno.meta}h</span>
                              </div>
                            </td>
                            <td data-label="Status">
                              <span className={`status-badge ${percentual === 100 ? 'status-aprovado' : 'status-pendente'}`}>
                                {percentual === 100 ? 'Concluído' : 'Em Andamento'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTEÚDO: SOLICITAÇÕES */}
            {abaAtiva === 'solicitacoes' && (
              <div className="conteudo-animado">
                <h2 className="titulo-secao-admin">Documentos Pendentes</h2>
                
                {/* BARRA DE FILTROS */}
                <div className="form-admin-inline" style={{ marginBottom: '1.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Buscar por nome do aluno ou matrícula..." 
                    value={filtroAluno}
                    onChange={(e) => setFiltroAluno(e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                    <option value="">Todas as Categorias</option>
                    <option value="Cursos">Cursos</option>
                    <option value="Eventos">Eventos</option>
                  </select>
                  <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                    <option value="">Todos os Tipos</option>
                    <option value="Interna">Interna</option>
                    <option value="Externa">Externa</option>
                  </select>
                </div>

                <div className="tabela-wrapper">
                  <table className="tabela-admin">
                    <thead>
                      <tr>
                        <th>Aluno</th>
                        <th>Matrícula</th>
                        <th>Categoria </th>
                        <th>Atividade</th>
                        <th>Horas</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitacoesFiltradas.map(sol => (
                        <tr key={sol.id} className="linha-atividade">
                          <td data-label="Aluno">{sol.aluno}</td>
                          <td data-label="Matrícula">{sol.matricula}</td>
                          <td data-label="Categoria / Tipo">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <span style={{ fontSize: '0.85rem' }}>{sol.categoria}</span>
                              <strong style={{ fontSize: '0.8rem', color: sol.tipo === 'Interna' ? '#1f8b4c' : '#0056b3' }}>{sol.tipo}</strong>
                            </div>
                          </td>
                          <td data-label="Atividade">{sol.atividade}</td>
                          <td data-label="Horas">{sol.horas}h</td>
                          <td data-label="Status">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <span className={`status-badge status-${sol.status.toLowerCase()}`}>
                                {sol.status}
                              </span>
                              {sol.status === 'Recusado' && sol.motivo && (
                                <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#b3261e', lineHeight: '1.3', maxWidth: '180px', textAlign: 'right' }}>
                                  <strong>Motivo:</strong> {sol.motivo}
                                </div>
                              )}
                            </div>
                          </td>
                          <td data-label="Ações">
                            <div className="acoes-tabela" style={{ alignItems: 'center' }}>
                              {sol.arquivo && (
                                <button 
                                  className="btn-acao btn-secundario" 
                                  style={{ padding: '0.3rem 0.5rem', marginRight: '0.2rem' }} 
                                  title="Visualizar Anexo" 
                                  onClick={() => setComprovanteSelecionado(sol)}
                                >
                                  📄
                                </button>
                              )}
                              {sol.status === 'Pendente' ? (
                                <>
                                  <button className="btn-acao btn-aprovar" onClick={() => handleAprovar(sol.id)}>Aprovar</button>
                                  <button className="btn-acao btn-recusar" onClick={() => handleRecusar(sol.id)}>Recusar</button>
                                </>
                              ) : (
                                <span className="status-avaliado">Avaliado</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTEÚDO: TIPOS DE ATIVIDADES */}
            {abaAtiva === 'atividades' && (
              <div className="conteudo-animado">
                <h2 className="titulo-secao-admin">Cadastrar Novo Tipo</h2>
                
                <form onSubmit={handleAdicionarAtividade} className="form-admin-inline">
                  <input 
                    type="text" 
                    placeholder="Categoria (ex: Cursos)" 
                    value={novaAtividade.categoria} 
                    onChange={(e) => setNovaAtividade({...novaAtividade, categoria: e.target.value})} 
                  />
                  <input 
                    type="text" 
                    placeholder="Nome da Atividade" 
                    value={novaAtividade.nome} 
                    onChange={(e) => setNovaAtividade({...novaAtividade, nome: e.target.value})} 
                  />
                  <select 
                    value={novaAtividade.tipo} 
                    onChange={(e) => setNovaAtividade({...novaAtividade, tipo: e.target.value})}
                  >
                    <option value="Interna">Interna</option>
                    <option value="Externa">Externa</option>
                  </select>
                  <input 
                    type="number" 
                    placeholder="Total Horas AC" 
                    value={novaAtividade.horas} 
                    onChange={(e) => setNovaAtividade({...novaAtividade, horas: e.target.value})} 
                    style={{ maxWidth: '150px' }}
                  />
                  <button type="submit" className="btn btn-principal">Adicionar</button>
                </form>

                <h2 className="titulo-secao-admin" style={{ marginTop: '2rem' }}>Atividades Cadastradas</h2>
                <div className="tabela-wrapper">
                  <table className="tabela-admin">
                    <thead>
                      <tr>
                        <th>Categoria</th>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Total Horas AC</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {atividades.map(ativ => (
                        <tr key={ativ.id}>
                          <td data-label="Categoria">{ativ.categoria}</td>
                          <td data-label="Nome"><strong>{ativ.nome}</strong></td>
                          <td data-label="Tipo">
                            <span className={`status-badge ${ativ.tipo === 'Interna' ? 'status-aprovado' : 'status-pendente'}`}>
                              {ativ.tipo}
                            </span>
                          </td>
                          <td data-label="Total Horas AC">{ativ.horas}h</td>
                          <td data-label="Ações">
                            <button className="btn-acao btn-perigo" onClick={() => handleRemoverAtividade(ativ.id)}>
                              🗑️ Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTEÚDO: EVENTOS */}
            {abaAtiva === 'eventos' && (
              <div className="conteudo-animado">
                <div className="header-eventos">
                  <h2 className="titulo-secao-admin">Eventos Cadastrados</h2>
                  <button 
                    className="btn btn-principal"
                    onClick={() => setMostrarFormEvento(!mostrarFormEvento)}
                  >
                    {mostrarFormEvento ? '✖ Cancelar' : '➕ Criar Novo Evento'}
                  </button>
                </div>

                {/* FORMULÁRIO ESTENDIDO DE CRIAÇÃO DE EVENTO */}
                {mostrarFormEvento && (
                  <form onSubmit={handleAdicionarEvento} style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--cor-secundaria)', fontSize: '1.1rem' }}>Detalhes do Evento Institucional</h3>
                    
                    <div className="form-admin-inline">
                      <input 
                        type="text" 
                        placeholder="Nome do Evento *" 
                        value={novoEvento.nome} 
                        onChange={(e) => setNovoEvento({...novoEvento, nome: e.target.value})} 
                        style={{ flex: '1 1 100%' }}
                        required
                      />
                      <select 
                        value={novoEvento.categoria} 
                        onChange={(e) => setNovoEvento({...novoEvento, categoria: e.target.value})} 
                        required
                      >
                        <option value="" disabled>Selecione a Categoria *</option>
                        {atividades.map(ativ => (
                          <option key={ativ.id} value={ativ.id}>{ativ.categoria} - {ativ.nome}</option>
                        ))}
                      </select>
                      <input 
                        type="date" 
                        value={novoEvento.data} 
                        onChange={(e) => setNovoEvento({...novoEvento, data: e.target.value})} 
                        required
                      />
                      <input 
                        type="text" 
                        placeholder="Horário (Ex: 14:00 às 18:00) *" 
                        value={novoEvento.hora} 
                        onChange={(e) => setNovoEvento({...novoEvento, hora: e.target.value})} 
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Horas AC *" 
                        value={novoEvento.horas} 
                        onChange={(e) => setNovoEvento({...novoEvento, horas: e.target.value})} 
                        style={{ maxWidth: '150px' }}
                        required
                      />
                    </div>

                    <div className="form-admin-inline" style={{ marginTop: '1rem' }}>
                      <input type="text" placeholder="Palestrante / Convidado" value={novoEvento.palestrante} onChange={(e) => setNovoEvento({...novoEvento, palestrante: e.target.value})} />
                      <input type="text" placeholder="Curso Alvo (Opcional)" value={novoEvento.cursoAlvo} onChange={(e) => setNovoEvento({...novoEvento, cursoAlvo: e.target.value})} />
                      <input type="text" placeholder="Unidade (Ex: Barra da Tijuca)" value={novoEvento.unidade} onChange={(e) => setNovoEvento({...novoEvento, unidade: e.target.value})} />
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn-principal">💾 Salvar e Publicar Evento</button>
                    </div>
                  </form>
                )}
                
                {/* BARRA DE FILTROS EVENTOS */}
                <div className="form-admin-inline" style={{ marginBottom: '1.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Buscar evento por nome..." 
                    value={filtroNomeEvento}
                    onChange={(e) => setFiltroNomeEvento(e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <select value={filtroTipoEvento} onChange={(e) => setFiltroTipoEvento(e.target.value)}>
                    <option value="">Todos os Tipos</option>
                    <option value="Interno">Interno</option>
                    <option value="Externo">Externo</option>
                  </select>
                </div>

                <div className="grid-dados">
                  {eventosFiltrados.map((evento) => (
                    <div key={evento.id} className="card-evento">
                      <strong>{evento.nome}</strong>
                      <div className="valor-info">Categoria: {evento.categoria || '-'}</div>
                      <div className="valor-info">Data/Hora: {evento.data} {evento.hora ? `às ${evento.hora}` : ''}</div>
                      {evento.palestrante && <div className="valor-info">Palestrante: {evento.palestrante}</div>}
                      {evento.cursoAlvo && (
                        <div className="valor-info" style={{ color: 'var(--cor-secundaria)', fontWeight: '600' }}>Alvo: {evento.cursoAlvo}</div>
                      )}
                      {evento.unidade && <div className="valor-info">Unidade: {evento.unidade}</div>}
                      <div className="valor-info">Horas AAC: {evento.horas}h</div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button className="btn btn-secundario btn-gerar-qr" style={{ flex: 1, padding: '0.5rem' }} onClick={() => setQrCodeSelecionado(evento)}>
                          QR Code
                        </button>
                        <button className="btn-acao btn-perigo" style={{ padding: '0.5rem 1rem' }} onClick={() => handleRemoverEvento(evento.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>

      </section>

      {/* MODAL DE VISUALIZAÇÃO DE COMPROVANTE (PDF) */}
      {comprovanteSelecionado && (
        <div className="modal-overlay-admin" onClick={() => setComprovanteSelecionado(null)}>
          <div className="modal-conteudo-admin" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-admin">
              <h3 style={{ margin: 0, color: 'var(--cor-secundaria)' }}>Comprovante: {comprovanteSelecionado.aluno}</h3>
              <button className="btn-fechar-admin" onClick={() => setComprovanteSelecionado(null)}>✖</button>
            </div>
            <div className="modal-body-admin">
              <iframe 
                src={comprovanteSelecionado.arquivo.dataUrl || comprovanteSelecionado.arquivo.url} 
                title={`Anexo de ${comprovanteSelecionado.aluno}`}
                className="iframe-comprovante"
              ></iframe>
            </div>
            <div className="modal-footer-admin">
              <a 
                href={comprovanteSelecionado.arquivo.dataUrl || comprovanteSelecionado.arquivo.url} 
                download={comprovanteSelecionado.arquivo.nome || 'comprovante.pdf'}
                className="btn btn-principal"
              >
                📥 Baixar Arquivo
              </a>
            </div>
          </div>
        </div>
      )}

{/* MODAL DE VISUALIZAÇÃO DO QR CODE */}
      {qrCodeSelecionado && (
        <div className="modal-overlay-admin" onClick={() => setQrCodeSelecionado(null)}>
          <div className="modal-conteudo-admin" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-header-admin">
              <h3 style={{ margin: 0, color: 'var(--cor-secundaria)' }}>QR Code do Evento</h3>
              <button className="btn-fechar-admin" onClick={() => setQrCodeSelecionado(null)}>✖</button>
            </div>
            
            <div className="modal-body-admin" style={{ padding: '2rem' }}>
              <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>{qrCodeSelecionado.nome}</p>
              
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  JSON.stringify({
                    evento_id: qrCodeSelecionado.id,
                    nome: qrCodeSelecionado.nome,
                    categoria: qrCodeSelecionado.categoria,
                    horas: qrCodeSelecionado.horas,
                    data: qrCodeSelecionado.data
                  })
                )}`} 
                alt={`QR Code para o evento ${qrCodeSelecionado.nome}`} 
                style={{ width: '250px', height: '250px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
                Os alunos podem escanear este código através do aplicativo para registrar presença.
              </p>
            </div>
            
            <div className="modal-footer-admin" style={{ justifyContent: 'center' }}>
              {/* ATENÇÃO: O botão de imprimir também precisa receber o mesmo JSON atualizado */}
              <button 
                className="btn btn-principal" 
                onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                  JSON.stringify({
                    evento_id: qrCodeSelecionado.id,
                    nome: qrCodeSelecionado.nome,
                    categoria: qrCodeSelecionado.categoria,
                    horas: qrCodeSelecionado.horas,
                    data: qrCodeSelecionado.data
                  })
                )}`, '_blank')}
              >
                🖨️ Imprimir / Ampliar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

