import React, { useState, useEffect } from 'react';

function Comprovante({ idSolicitacao = '123' }) { // Recebe o ID da solicitação por prop
  // 1. Estados para os dados da API
  const [dadosSolicitacao, setDadosSolicitacao] = useState(null);
  const [carregandoDados, setCarregandoDados] = useState(true);

  // 2. Estados para o formulário de validação
  const [codigo, setCodigo] = useState('');
  const [status, setStatus] = useState('Pendente'); // 'Pendente', 'Validado', 'Inválido'
  const [mensagemEnvio, setMensagemEnvio] = useState('');
  const [validando, setValidando] = useState(false);

  // ==========================================
  // BUSCAR DADOS INICIAIS DA SOLICITAÇÃO
  // ==========================================
  useEffect(() => {
    async function buscarDados() {
      try {
        // Exemplo: /api/solicitacoes/123
        const resposta = await fetch(`/api/solicitacoes/${idSolicitacao}`);
        if (!resposta.ok) throw new Error('Erro ao buscar dados');
        
        const dados = await resposta.json();
        setDadosSolicitacao(dados);
        
        // Se a API já disser que está validado, atualizamos o status
        if (dados.status === 'Validado') {
          setStatus('Validado');
        }
      } catch (erro) {
        console.error(erro);
      } finally {
        setCarregandoDados(false);
      }
    }

    buscarDados();
  }, [idSolicitacao]);

  // ==========================================
  // LÓGICA DE VALIDAÇÃO DO CÓDIGO
  // ==========================================
  async function handleValidarCodigo(evento) {
    evento.preventDefault();

    if (!codigo.trim()) {
      setMensagemEnvio('Informe o código do comprovante.');
      setStatus('Inválido');
      return;
    }

    setValidando(true);
    setMensagemEnvio('');

    try {
      // Envia o código para a API validar no banco
      const resposta = await fetch('/api/validar-comprovante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idSolicitacao, codigo: codigo.trim() }),
      });

      if (resposta.ok) {
        setStatus('Validado');
        setMensagemEnvio('Comprovante validado com sucesso.');
      } else {
        setStatus('Inválido');
        setMensagemEnvio('Código de comprovante inválido ou não reconhecido.');
      }
    } catch (erro) {
      console.error(erro);
      setStatus('Inválido');
      setMensagemEnvio('Erro de conexão ao tentar validar.');
    } finally {
      setValidando(false);
    }
  }

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
    <main className="container-principal">
      <div className="card-comprovante">
        <h1>Comprovante de envio</h1>
        <p className="subtitulo">Confira o status do envio dos certificados e valide o comprovante.</p>

        <section className="resumo">
          <div className="bloco-status">
            <span className="rotulo">Status atual</span>
            {/* A cor e o texto mudam dinamicamente baseados no estado */}
            <strong 
              id="statusAtual" 
              style={{ color: status === 'Validado' ? 'green' : status === 'Inválido' ? 'red' : '#F5AC00' }}
            >
              {status}
            </strong>
            
            <p className="texto-status">
              {status === 'Pendente' && 'O comprovante ainda não foi validado pelo portal.'}
              {status === 'Validado' && 'O comprovante é válido e o envio dos certificados foi confirmado.'}
              {status === 'Inválido' && 'O código não foi reconhecido ou está pendente.'}
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

        {/* Adicionei o formulário que estava no seu JS mas faltava no JSX */}
        <section className="validacao-section" style={{ marginTop: '2rem' }}>
          <form id="formularioValidacao" onSubmit={handleValidarCodigo}>
            <div className="campo">
              <label htmlFor="codigoComprovante">Código de Validação</label>
              <input 
                type="text" 
                id="codigoComprovante" 
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)} // Atualiza o estado ao digitar
                placeholder="Ex: AAC-2026-0558"
                disabled={status === 'Validado'} // Bloqueia se já estiver validado
              />
            </div>

            <button 
              type="submit" 
              id="botaoValidar" 
              className="btn btn-principal"
              disabled={validando || status === 'Validado'}
              style={{ marginTop: '1rem' }}
            >
              {validando ? 'Validando...' : 'Validar comprovante'}
            </button>
          </form>

          {/* Mensagem de Retorno */}
          {mensagemEnvio && (
            <div 
              className={`retorno ${status === 'Validado' ? 'sucesso' : 'erro'}`} 
              style={{ marginTop: '1rem', fontWeight: 'bold' }}
            >
              {mensagemEnvio}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Comprovante;