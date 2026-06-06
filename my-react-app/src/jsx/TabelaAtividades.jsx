import React, { useState, useEffect } from 'react';
import '../css/tabelaAtividades.css';

export default function AppAtividades() {
  const [listaAtividades, setListaAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDadosDaApi() {
      // 1. Criamos a nossa lista de "backup" para deixar a tela bonita
      const MOCK_ATIVIDADES = [
        { id: 1, tipo: 'Interna', nome: 'Workshop: Design Thinking', data: '15/04/2026', horas: 4, status: 'Aprovado' },
        { id: 2, tipo: 'Externa', nome: 'Palestra: Inovação Disruptiva', data: '10/04/2026', horas: 2, status: 'Pendente' },
        { id: 3, tipo: 'Interna', nome: 'Curso: Python Avançado', data: '08/04/2026', horas: 8, status: 'Aprovado' },
        { id: 4, tipo: 'Externa', nome: 'Seminário: Empreendedorismo', data: '05/04/2026', horas: 3, status: 'Recusado', motivo: 'O certificado anexado não possui informações sobre a carga horária do evento nem o CNPJ da instituição emissora.' },
        { id: 5, tipo: 'Interna', nome: 'Mentoria: Liderança', data: '02/04/2026', horas: 2, status: 'Pendente' },
        { id: 6, tipo: 'Externa', nome: 'Congresso: Tecnologia e Sociedade', data: '28/03/2026', horas: 6, status: 'Aprovado' }
      ];

      try {
        const resp = await fetch('/api/atividades'); 
        
        if (!resp.ok) {
          throw new Error('Erro ao buscar atividades');
        }

        const dados = await resp.json();
        
        // Se a API retornar um array vazio (ou nulo), usamos o Mock para a tela não ficar vazia
        setListaAtividades(dados && dados.length > 0 ? dados : MOCK_ATIVIDADES); 

      } catch (error) {
        console.error('API indisponível, usando dados de demonstração:', error);
        
        // 2. A MÁGICA: Se der erro (API offline), preenchemos com os dados falsos!
        setListaAtividades(MOCK_ATIVIDADES); 
      } finally {
        setCarregando(false); 
      }
    }

    buscarDadosDaApi();
  }, []);

  if (carregando) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Carregando atividades...</p>;
  }

  return (
    <>
      <TabelaAtividades atividades={listaAtividades} />
    </>
  );
}

// O seu componente TabelaAtividades continua exatamente igual aqui embaixo...
function TabelaAtividades({ atividades = [] }) {
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  const atividadesFiltradas = atividades.filter((atividade) => {
    const status = atividade.status || 'Pendente';
    if (filtroStatus === 'Todos') return true;
    if (filtroStatus === 'Em Andamento') return status === 'Pendente';
    return status === filtroStatus;
  });

  function fecharModal() {
    setAtividadeSelecionada(null);
  }

  return (
    <main className="container-principal">
      <section className="atividades-container">
        <h2 className="titulo-secao">Solicitações de Atividades Complementares</h2>

        {/* BARRA DE FILTROS DE STATUS */}
        <div className="filtros-dashboard" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${filtroStatus === 'Todos' ? 'btn-principal' : 'btn-secundario'}`}
            onClick={() => setFiltroStatus('Todos')}
          >
            📊 Todas
          </button>
          <button 
            className={`btn ${filtroStatus === 'Aprovado' ? 'btn-principal' : 'btn-secundario'}`}
            onClick={() => setFiltroStatus('Aprovado')}
          >
            ✓ Aprovadas
          </button>
          <button 
            className={`btn ${filtroStatus === 'Em Andamento' ? 'btn-principal' : 'btn-secundario'}`}
            onClick={() => setFiltroStatus('Em Andamento')}
          >
            ⏳ Em Andamento
          </button>
          <button 
            className={`btn ${filtroStatus === 'Recusado' ? 'btn-principal' : 'btn-secundario'}`}
            onClick={() => setFiltroStatus('Recusado')}
          >
            ✗ Recusadas
          </button>
        </div>

        <div className="tabela-wrapper">
          <table className="tabela-atividades" role="table">
            <thead>
              <tr>
                <th scope="col">Tipo</th>
                <th scope="col">Nome da Atividade</th>
                <th scope="col">Data</th>
                <th scope="col">Horas</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {atividadesFiltradas.map((atividade, i) => (
                <tr 
                  key={atividade.id || i} 
                  className="linha-atividade"
                  onClick={() => setAtividadeSelecionada(atividade)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <span className={`tipo-badge ${atividade.tipo.toLowerCase() === 'interna' ? 'interno-badge' : 'externo-badge'}`}>
                      {atividade.tipo}
                    </span>
                  </td>
                  <td className="nome-atividade">{atividade.nome}</td>
                  <td className="data">{atividade.data}</td>
                  <td className="horas">
                    {typeof atividade.horas === 'number' ? `${atividade.horas}h` : atividade.horas}
                  </td>
                  <td className="status">
                    <span style={{ 
                      color: atividade.status === 'Aprovado' ? '#1f8b4c' : atividade.status === 'Recusado' ? '#b3261e' : '#F5AC00',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      {atividade.status === 'Aprovado' ? '✓ Aprovado' : atividade.status === 'Recusado' ? '✗ Recusado' : '⏳ Em Andamento'}
                    </span>
                    {atividade.status === 'Recusado' && atividade.motivo && (
                      <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#b3261e', lineHeight: '1.3', maxWidth: '200px' }}>
                        <strong>Motivo:</strong> {atividade.motivo}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              
              {atividadesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                    Nenhuma atividade encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL DE DETALHES DA ATIVIDADE */}
      {atividadeSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 37, 85, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }} onClick={fecharModal}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '500px', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: 'slideDown 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, color: 'var(--cor-secundaria)', fontSize: '1.2rem' }}>Detalhes da Solicitação</h3>
              <button onClick={fecharModal} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>✖</button>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1rem', color: '#333' }}>
              <div><strong>Atividade:</strong> {atividadeSelecionada.nome}</div>
              <div><strong>Tipo:</strong> {atividadeSelecionada.tipo}</div>
              <div><strong>Data de Conclusão:</strong> {atividadeSelecionada.data}</div>
              <div><strong>Carga Horária:</strong> {typeof atividadeSelecionada.horas === 'number' ? `${atividadeSelecionada.horas}h` : atividadeSelecionada.horas}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong style={{ marginRight: '0.5rem' }}>Status:</strong> 
                <span style={{ color: atividadeSelecionada.status === 'Aprovado' ? '#1f8b4c' : atividadeSelecionada.status === 'Recusado' ? '#b3261e' : '#F5AC00', fontWeight: '700', background: atividadeSelecionada.status === 'Aprovado' ? 'rgba(31, 139, 76, 0.1)' : atividadeSelecionada.status === 'Recusado' ? 'rgba(179, 38, 30, 0.1)' : 'rgba(245, 172, 0, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {atividadeSelecionada.status}
                </span>
              </div>
              
              {atividadeSelecionada.status === 'Recusado' && atividadeSelecionada.motivo && (
                <div style={{ background: 'rgba(179, 38, 30, 0.05)', borderLeft: '4px solid #b3261e', padding: '1rem', borderRadius: '4px', color: '#b3261e', marginTop: '0.5rem' }}>
                  <strong>Motivo da Recusa:</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>{atividadeSelecionada.motivo}</p>
                </div>
              )}
            </div>
            
            <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <button className="btn btn-secundario" onClick={fecharModal}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}