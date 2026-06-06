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
      { matricula: '2026101', nome: 'João Silva', curso: 'Ciência da Computação', horasCumpridas: 80, meta: 120 },
      { matricula: '2026102', nome: 'Maria Souza', curso: 'Administração', horasCumpridas: 120, meta: 120 },
      { matricula: '2026103', nome: 'Carlos Mendes', curso: 'Direito', horasCumpridas: 45, meta: 150 },
      { matricula: '2026104', nome: 'Ana Beatriz', curso: 'Relações Internacionais', horasCumpridas: 10, meta: 100 }
    ]);

    // Mock de solicitações pendentes
    setSolicitacoes([
      { id: '1', aluno: 'João Silva', matricula: '2026101', atividade: 'Curso de Python Avançado', horas: 10, status: 'Pendente' },
      { id: '2', aluno: 'Maria Souza', matricula: '2026102', atividade: 'Palestra de Inovação', horas: 2, status: 'Pendente' },
      { id: '3', aluno: 'Carlos Mendes', matricula: '2026103', atividade: 'Workshop de Design Thinking', horas: 4, status: 'Aprovado' }
    ]);

    // Mock de eventos cadastrados
    setEventos([
      { id: '1', nome: 'Semana da Computação IBMEC', data: '15/05/2026', horas: 20 },
      { id: '2', nome: 'Palestra Carreira Tech', data: '20/05/2026', horas: 3 }
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
              📅 Eventos Internos
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
                <div className="tabela-wrapper">
                  <table className="tabela-admin">
                    <thead>
                      <tr>
                        <th>Matrícula</th>
                        <th>Nome do Aluno</th>
                        <th>Curso</th>
                        <th>Progresso AAC</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alunos.map(aluno => {
                        const percentual = Math.min(100, Math.round((aluno.horasCumpridas / aluno.meta) * 100));
                        return (
                          <tr key={aluno.matricula}>
                            <td><strong>{aluno.matricula}</strong></td>
                            <td>{aluno.nome}</td>
                            <td>{aluno.curso}</td>
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
                <div className="tabela-wrapper">
                  <table className="tabela-admin">
                    <thead>
                      <tr>
                        <th>Aluno</th>
                        <th>Matrícula</th>
                        <th>Atividade</th>
                        <th>Horas</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitacoes.map(sol => (
                        <tr key={sol.id} className="linha-atividade">
                          <td>{sol.aluno}</td>
                          <td>{sol.matricula}</td>
                          <td>{sol.atividade}</td>
                          <td>{sol.horas}h</td>
                          <td>
                            <span className={`status-badge status-${sol.status.toLowerCase()}`}>
                              {sol.status}
                            </span>
                          </td>
                          <td>
                            {sol.status === 'Pendente' ? (
                              <div className="acoes-tabela">
                                <button className="btn-acao btn-aprovar" onClick={() => handleAprovar(sol.id)}>
                                  Aprovar
                                </button>
                                <button className="btn-acao btn-recusar" onClick={() => handleRecusar(sol.id)}>
                                  Recusar
                                </button>
                              </div>
                            ) : (
                              <span className="status-avaliado">Avaliado</span>
                            )}
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
                  <button className="btn btn-principal">➕ Criar Novo Evento</button>
                </div>
                <div className="grid-dados">
                  {eventos.map((evento) => (
                    <div key={evento.id} className="card-evento">
                      <strong>{evento.nome}</strong>
                      <div className="valor-info">Data: {evento.data}</div>
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
    </main>
  );
}