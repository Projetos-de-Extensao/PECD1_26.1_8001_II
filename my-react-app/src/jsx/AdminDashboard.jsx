import React, { useState, useEffect } from 'react';
import '../css/index.css';
import '../css/adminDashboard.css';

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

  // Simulando a busca de dados do banco de dados ao carregar a página
  useEffect(() => {
    // Mock de métricas gerenciais
    setMetricas({
      totalAlunos: 1250,
      totalSolicitacoes: 485,
      atendidas: 430,
      aguardando: 55,
      internas: 300,
      externas: 185
    });

    // Mock de alunos cadastrados
    setAlunos([
      { matricula: '2026101', nome: 'João Silva', curso: 'Ciência da Computação', horasCumpridas: 80, meta: 120, internas: 50, metaInternas: 60, externas: 30, metaExternas: 60 },
      { matricula: '2026102', nome: 'Maria Souza', curso: 'Administração', horasCumpridas: 120, meta: 120, internas: 60, metaInternas: 60, externas: 60, metaExternas: 60 },
      { matricula: '2026103', nome: 'Carlos Mendes', curso: 'Direito', horasCumpridas: 45, meta: 150, internas: 30, metaInternas: 75, externas: 15, metaExternas: 75 },
      { matricula: '2026104', nome: 'Ana Beatriz', curso: 'Relações Internacionais', horasCumpridas: 10, meta: 100, internas: 10, metaInternas: 50, externas: 0, metaExternas: 50 }
    ]);

    // Mock de solicitações pendentes
    setSolicitacoes([
      { id: '1', aluno: 'João Silva', matricula: '2026101', categoria: 'Cursos', tipo: 'Interna', atividade: 'Curso de Python Avançado', horas: 10, status: 'Pendente' },
      { id: '2', aluno: 'Maria Souza', matricula: '2026102', categoria: 'Eventos', tipo: 'Externa', atividade: 'Palestra de Inovação', horas: 2, status: 'Pendente', arquivo: { nome: 'certificado_maria.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' } },
      { id: '3', aluno: 'Carlos Mendes', matricula: '2026103', categoria: 'Eventos', tipo: 'Interna', atividade: 'Workshop de Design Thinking', horas: 4, status: 'Aprovado', arquivo: { nome: 'comprovante.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' } },
      { id: '4', aluno: 'Ana Beatriz', matricula: '2026104', categoria: 'Cursos', tipo: 'Interna', atividade: 'Design Gráfico', horas: 5, status: 'Recusado', motivo: 'Comprovante ilegível. Por favor, envie novamente.' }
    ]);

    // Mock de eventos cadastrados
    setEventos([
      { id: '1', nome: 'Semana da Computação IBMEC', data: '15/05/2026', horas: 20, tipo: 'Interno', categoria: 'Semana Acadêmica', cursoAlvo: 'Tecnologia', palestrante: 'Vários Palestrantes' },
      { id: '2', nome: 'Palestra Carreira Tech', data: '20/05/2026', horas: 3, tipo: 'Externo', categoria: 'Palestra', cursoAlvo: 'Todos', palestrante: 'Maria Inovação' }
    ]);

    // Mock de Tipos de Atividades
    setAtividades([
      { id: '1', categoria: 'Cursos', nome: 'Curso de Extensão', tipo: 'Interna', horas: 40 },
      { id: '2', categoria: 'Eventos', nome: 'Participação em Palestra', tipo: 'Externa', horas: 5 }
    ]);
  }, []);

  // Funções para lidar com as ações do avaliador
  function handleAprovar(id) {
    setSolicitacoes(prev => prev.map(s => s.id === id ? { ...s, status: 'Aprovado' } : s));
  }

  function handleRecusar(id) {
    const motivo = prompt('Qual o motivo da recusa?');
    if (motivo) {
      setSolicitacoes(prev => prev.map(s => s.id === id ? { ...s, status: 'Recusado', motivo } : s));
    }
  }

  function handleRemoverEvento(id) {
    if(window.confirm('Tem certeza que deseja remover este evento?')) {
      setEventos(prev => prev.filter(e => e.id !== id));
    }
  }

  // Funções para gerenciar Tipos de Atividades
  function handleAdicionarAtividade(e) {
    e.preventDefault();
    if (!novaAtividade.nome || !novaAtividade.categoria || !novaAtividade.horas) {
      alert('Preencha os campos obrigatórios (Categoria, Nome e Horas).');
      return;
    }
    const id = Date.now().toString();
    setAtividades(prev => [...prev, { id, ...novaAtividade }]);
    setNovaAtividade({ categoria: '', nome: '', tipo: 'Interna', horas: '' });
  }

  function handleRemoverAtividade(id) {
    if (window.confirm('Tem certeza que deseja remover este tipo de atividade?')) {
      setAtividades(prev => prev.filter(a => a.id !== id));
    }
  }

  // Função para criar o evento a partir do formulário estendido
  function handleAdicionarEvento(e) {
    e.preventDefault();
    if (!novoEvento.nome || !novoEvento.categoria || !novoEvento.hora || !novoEvento.horas) {
      alert('Preencha os campos obrigatórios (Nome, Categoria, Horário e Horas).');
      return;
    }
    
    const id = Date.now().toString();
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    setEventos(prev => [{
      id, ...novoEvento, data: dataAtual
    }, ...prev]);
    
    // Limpa o formulário e esconde
    setNovoEvento({ nome: '', categoria: '', hora: '', horas: '', cursoAlvo: '', palestrante: '', unidade: '', tipo: 'Interno' });
    setMostrarFormEvento(false);
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
                            <td><strong>{aluno.matricula}</strong></td>
                            <td>{aluno.nome}</td>
                            <td>{aluno.curso}</td>
                            <td>
                              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: pctInternas === 100 ? '#1f8b4c' : '#F5AC00' }}>
                                {aluno.internas}/{aluno.metaInternas}h
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: pctExternas === 100 ? '#1f8b4c' : '#6366f1' }}>
                                {aluno.externas}/{aluno.metaExternas}h
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '100%', background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${percentual}%`, background: percentual === 100 ? '#1f8b4c' : 'var(--cor-secundaria)', height: '100%' }}></div>
                                </div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{aluno.horasCumpridas}/{aluno.meta}h</span>
                              </div>
                            </td>
                            <td>
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
                        <th>Categoria / Tipo</th>
                        <th>Atividade</th>
                        <th>Horas</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitacoesFiltradas.map(sol => (
                        <tr key={sol.id} className="linha-atividade">
                          <td>{sol.aluno}</td>
                          <td>{sol.matricula}</td>
                          <td>
                            <div style={{ fontSize: '0.85rem' }}>{sol.categoria}</div>
                            <strong style={{ fontSize: '0.8rem', color: sol.tipo === 'Interna' ? '#1f8b4c' : '#0056b3' }}>{sol.tipo}</strong>
                          </td>
                          <td>{sol.atividade}</td>
                          <td>{sol.horas}h</td>
                          <td>
                            <span className={`status-badge status-${sol.status.toLowerCase()}`}>
                              {sol.status}
                            </span>
                            {sol.status === 'Recusado' && sol.motivo && (
                              <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#b3261e', lineHeight: '1.3', maxWidth: '180px' }}>
                                <strong>Motivo:</strong> {sol.motivo}
                              </div>
                            )}
                          </td>
                          <td>
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
                          <td>{ativ.categoria}</td>
                          <td><strong>{ativ.nome}</strong></td>
                          <td>
                            <span className={`status-badge ${ativ.tipo === 'Interna' ? 'status-aprovado' : 'status-pendente'}`}>
                              {ativ.tipo}
                            </span>
                          </td>
                          <td>{ativ.horas}h</td>
                          <td>
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
                          <option key={ativ.id} value={ativ.nome}>{ativ.categoria} - {ativ.nome}</option>
                        ))}
                      </select>
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
                        <button className="btn btn-secundario btn-gerar-qr" style={{ flex: 1, padding: '0.5rem' }}>
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
    </main>
  );
}