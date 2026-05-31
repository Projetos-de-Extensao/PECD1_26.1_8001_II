import React, { useState, useEffect } from 'react';

export default function AppAtividades() {
  const [listaAtividades, setListaAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDadosDaApi() {
      try {
        const resp = await fetch('/api/atividades'); 
        
        if (!resp.ok) {
          throw new Error('Erro ao buscar atividades');
        }

        const dados = await resp.json();
        setListaAtividades(dados); 

      } catch (error) {
        console.error('Erro na API de atividades:', error);
        setListaAtividades([]); 
      } finally {
        setCarregando(false); 
      }
    }

    buscarDadosDaApi(); // Executa a função ao montar o componente
  }, []);

  // Mostra uma mensagem enquanto a API não responde
  if (carregando) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Carregando atividades...</p>;
  }

  // Passa os dados recebidos da API para a tabela
  return (
    <>
      <TabelaAtividades atividades={listaAtividades} filtro="Todas" />
    </>
  );
}


function TabelaAtividades({ atividades = [], filtro = 'Todas' }) {
  
  const atividadesFiltradas = atividades.filter((atividade) => {
    if (filtro === 'Todas') return true;
    
    return atividade.tipo.toLowerCase() === filtro.toLowerCase();
  });

  return (
    <main className="container-principal">
      <section className="atividades-container">
        <h2 className="titulo-secao">Atividades Aprovadas</h2>
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
                <tr key={atividade.id || i} className="linha-atividade">
                  <td>
                    <span className={`tipo-badge ${atividade.tipo.toLowerCase() === 'interna' ? 'interno-badge' : 'externo-badge'}`}>
                      {atividade.tipo}
                    </span>
                  </td>
                  <td className="nome-atividade">{atividade.nome}</td>
                  <td className="data">{atividade.data}</td>
                  <td className="horas">
                    {/* Previne erro visual caso a API envie apenas o número em vez de "4h" */}
                    {typeof atividade.horas === 'number' ? `${atividade.horas}h` : atividade.horas}
                  </td>
                  <td className="status aprovado">✓ Aprovado</td>
                </tr>
              ))}
              
              {/* Tratamento caso a API retorne vazia */}
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
    </main>
  );
}

