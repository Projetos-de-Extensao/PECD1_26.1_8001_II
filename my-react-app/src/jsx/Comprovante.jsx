import React, { useState, useEffect } from 'react';
import '../css/Comprovante.css';

function Comprovante({ idSolicitacao = '123' }) { // Recebe o ID da solicitação por prop
  // 1. Estados para os dados da API
  const [dadosSolicitacao, setDadosSolicitacao] = useState(null);
  const [carregandoDados, setCarregandoDados] = useState(true);

  // ==========================================
  // BUSCAR DADOS INICIAIS DA SOLICITAÇÃO
  // ==========================================
  useEffect(() => {
    async function buscarDados() {
      try {
        const resposta = await fetch(`http://localhost:8000/api/solicitacoes/${idSolicitacao}/`);
        if (!resposta.ok) throw new Error('Erro ao buscar dados');
        
        const dados = await resposta.json();
        setDadosSolicitacao(dados);
        
      } catch (erro) {
        console.error(erro);
      } finally {
        setCarregandoDados(false);
      }
    }

    buscarDados();
  }, [idSolicitacao]);

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================
  if (carregandoDados) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando dados do comprovante...</p>;
  }

  if (!dadosSolicitacao) {
    return <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Solicitação não encontrada.</p>;
  }

  return (
    <div style={{ padding: '1rem 1.5rem' }}>
      <div className="card-comprovante" style={{ margin: 0, padding: 0, boxShadow: 'none', border: 'none' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Comprovante #{idSolicitacao}</h1>
        <p className="subtitulo">Aqui estão os detalhes da sua solicitação.</p>

        <section className="resumo">
          <div className="bloco-status">
            <span className="rotulo">Status atual</span>
            {/* A cor e o texto mudam dinamicamente baseados no estado */}
            <strong 
              id="statusAtual" 
              style={{ color: dadosSolicitacao.status === 'Aprovada' ? 'green' : dadosSolicitacao.status === 'Rejeitada' ? 'red' : '#F5AC00' }}
            >
              {dadosSolicitacao.status === 'Aprovada' ? 'Aprovado' : dadosSolicitacao.status === 'Rejeitada' ? 'Recusado' : 'Em Andamento'}
            </strong>
            
            <p className="texto-status">
              {dadosSolicitacao.status === 'Pendente' && 'A solicitação está aguardando avaliação.'}
              {dadosSolicitacao.status === 'Aprovada' && 'A solicitação foi aprovada e as horas foram computadas.'}
              {dadosSolicitacao.status === 'Rejeitada' && 'A solicitação foi recusada pelo avaliador.'}
            </p>
          </div>

          <div className="bloco-infos">
            <div>
              <span className="rotulo">Data do envio</span>
              {/* Renderiza a data que veio da API */}
              <strong id="dataEnvio">{dadosSolicitacao.dataEnvio || '03/05/2026'}</strong>
            </div>
            <div>
              <span className="rotulo">Tipo de certificado</span>
              {/* Renderiza o tipo que veio da API */}
              <strong id="nomeResponsavel">{dadosSolicitacao.tipo || 'Certificados AAC'}</strong>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Comprovante;