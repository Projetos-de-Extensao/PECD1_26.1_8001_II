import { useEffect, useMemo, useState } from 'react';
import NavBar from './NavBar';
import {
  listarComprovantes,
  aprovarComprovante,
  recusarComprovante,
  inscreverMudancas,
} from './api/comprovantesApi';
import '../css/validacao-comprovantes.css';

const ABAS = [
  { filtro: 'pendente',  label: '⏳ Pendentes' },
  { filtro: 'aprovado',  label: '✓ Aprovados'  },
  { filtro: 'recusado',  label: '✗ Recusados'  },
  { filtro: 'todos',     label: 'Todos'        },
];

const STATUS_CONFIG = {
  pendente: { icone: '⏳', label: 'Pendente' },
  aprovado: { icone: '✓',  label: 'Aprovado' },
  recusado: { icone: '✗',  label: 'Recusado' },
};

function formatarTamanho(bytes) {
  if (!bytes) return '';
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

function ValidacaoComprovantes() {
  const [comprovantes, setComprovantes] = useState([]);
  const [carregando,   setCarregando]   = useState(true);
  const [erroCarga,    setErroCarga]    = useState('');
  const [filtro,       setFiltro]       = useState('pendente');
  const [busca,        setBusca]        = useState('');
  const [selecionado,  setSelecionado]  = useState(null);
  const [modalRecusa,  setModalRecusa]  = useState({ aberto: false, id: null, motivo: '' });
  const [toast,        setToast]        = useState({ visivel: false, tipo: '', mensagem: '' });

  async function recarregar() {
    try {
      const lista = await listarComprovantes();
      setComprovantes(lista);
      setErroCarga('');
    } catch (err) {
      setErroCarga(err.message || 'Erro ao carregar comprovantes.');
    } finally {
      setCarregando(false);
    }
  }

  // Carrega inicial + inscreve para mudanças (aluno envia em outra aba → atualiza aqui)
  useEffect(() => {
    recarregar();
    const cleanup = inscreverMudancas(() => recarregar());
    return cleanup;
  }, []);

  // Mantém o modal de detalhes em sincronia com a lista
  useEffect(() => {
    if (!selecionado) return;
    const atualizado = comprovantes.find(c => c.id === selecionado.id);
    if (atualizado) setSelecionado(atualizado);
    else setSelecionado(null);
  }, [comprovantes]); // eslint-disable-line react-hooks/exhaustive-deps

  const contadores = useMemo(() => ({
    todos:    comprovantes.length,
    pendente: comprovantes.filter(c => c.status === 'pendente').length,
    aprovado: comprovantes.filter(c => c.status === 'aprovado').length,
    recusado: comprovantes.filter(c => c.status === 'recusado').length,
  }), [comprovantes]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return comprovantes
      .filter(c => filtro === 'todos' ? true : c.status === filtro)
      .filter(c => !termo
        || c.aluno.toLowerCase().includes(termo)
        || String(c.matricula).toLowerCase().includes(termo)
        || c.atividade.toLowerCase().includes(termo)
        || c.id.toLowerCase().includes(termo));
  }, [comprovantes, filtro, busca]);

  function exibirToast(tipo, mensagem) {
    setToast({ visivel: true, tipo, mensagem });
    setTimeout(() => setToast({ visivel: false, tipo: '', mensagem: '' }), 3200);
  }

  async function aprovar(id) {
    try {
      await aprovarComprovante(id);
      await recarregar();
      exibirToast('sucesso', 'Comprovante aprovado. O aluno foi notificado.');
    } catch (err) {
      exibirToast('erro', err.message || 'Erro ao aprovar comprovante.');
    }
  }

  function abrirRecusa(id) {
    setModalRecusa({ aberto: true, id, motivo: '' });
  }

  async function confirmarRecusa() {
    const motivo = modalRecusa.motivo.trim();
    if (!motivo) return;
    try {
      await recusarComprovante(modalRecusa.id, motivo);
      await recarregar();
      setModalRecusa({ aberto: false, id: null, motivo: '' });
      exibirToast('erro', 'Comprovante recusado. O aluno foi notificado com o motivo.');
    } catch (err) {
      exibirToast('erro', err.message || 'Erro ao recusar comprovante.');
    }
  }

  function fecharRecusa() {
    setModalRecusa({ aberto: false, id: null, motivo: '' });
  }

  function abrirArquivo(arquivo) {
    if (!arquivo?.dataUrl) return;
    const win = window.open();
    if (!win) return;
    if (arquivo.tipo?.startsWith('image/')) {
      win.document.write(`<img src="${arquivo.dataUrl}" style="max-width:100%;height:auto;" alt="${arquivo.nome}" />`);
    } else {
      win.location.href = arquivo.dataUrl;
    }
  }

  return (
    <>
      <NavBar />

      <main className="container-principal">
        <section className="validacao-container">
          <div className="header-validacao">
            <h1 className="titulo-validacao">Validação de Comprovantes</h1>
            <p className="subtitulo-validacao">
              Analise os comprovantes enviados pelos alunos e registre a decisão da Coordenação.
            </p>
          </div>

          <div className="painel-resumo">
            <div className="card-resumo card-pendente">
              <span className="card-rotulo">Pendentes</span>
              <strong className="card-valor">{contadores.pendente}</strong>
              <span className="card-hint">Aguardando análise</span>
            </div>
            <div className="card-resumo card-aprovado">
              <span className="card-rotulo">Aprovados</span>
              <strong className="card-valor">{contadores.aprovado}</strong>
              <span className="card-hint">Horas validadas</span>
            </div>
            <div className="card-resumo card-recusado">
              <span className="card-rotulo">Recusados</span>
              <strong className="card-valor">{contadores.recusado}</strong>
              <span className="card-hint">Necessitam reenvio</span>
            </div>
            <div className="card-resumo card-total">
              <span className="card-rotulo">Total recebido</span>
              <strong className="card-valor">{contadores.todos}</strong>
              <span className="card-hint">Comprovantes no sistema</span>
            </div>
          </div>

          <div className="barra-acoes">
            <div className="abas-filtro">
              {ABAS.map(aba => (
                <button
                  key={aba.filtro}
                  className={`aba-btn${filtro === aba.filtro ? ' aba-ativo' : ''}`}
                  onClick={() => setFiltro(aba.filtro)}
                >
                  <span className="aba-label">{aba.label}</span>
                  <span className="aba-count">{contadores[aba.filtro]}</span>
                </button>
              ))}
            </div>

            <div className="campo-busca">
              <span className="icone-busca" aria-hidden="true">🔍</span>
              <input
                type="search"
                placeholder="Buscar por aluno, matrícula, atividade ou código..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                aria-label="Buscar comprovantes"
              />
            </div>
          </div>

          <div className="tabela-wrapper">
            {carregando ? (
              <div className="msg-vazio"><p>Carregando comprovantes...</p></div>
            ) : erroCarga ? (
              <div className="msg-vazio">
                <p><strong>Erro ao carregar.</strong></p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{erroCarga}</p>
                <button
                  type="button"
                  className="btn-acao btn-ver"
                  style={{ marginTop: '1rem' }}
                  onClick={recarregar}
                >
                  Tentar novamente
                </button>
              </div>
            ) : filtrados.length === 0 ? (
              <div className="msg-vazio">
                {comprovantes.length === 0 ? (
                  <>
                    <p><strong>Nenhum comprovante foi enviado ainda.</strong></p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      Assim que um aluno enviar um comprovante pelo portal, ele aparecerá aqui automaticamente.
                    </p>
                  </>
                ) : (
                  <p>Nenhum comprovante encontrado para esse filtro.</p>
                )}
              </div>
            ) : (
              <table className="tabela-validacao" role="table">
                <thead>
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Aluno</th>
                    <th scope="col">Atividade</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Horas</th>
                    <th scope="col">Envio</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map(c => {
                    const st = STATUS_CONFIG[c.status];
                    return (
                      <tr key={c.id}>
                        <td className="codigo-comprovante">{c.id}</td>
                        <td>
                          <div className="info-aluno">
                            <strong>{c.aluno}</strong>
                            <span>{c.matricula} • {c.curso}</span>
                          </div>
                        </td>
                        <td className="nome-atividade">{c.atividade}</td>
                        <td>
                          <span className={`tipo-atividade tipo-${c.tipo}`}>
                            {c.tipo === 'interna' ? 'Interna' : 'Externa'}
                          </span>
                        </td>
                        <td className="horas-atividade">{c.horas}h</td>
                        <td className="data-atividade">{c.dataEnvio}</td>
                        <td>
                          <span className={`status-badge status-${c.status}`}>
                            <span aria-hidden="true">{st.icone}</span>
                            <span>{st.label}</span>
                          </span>
                        </td>
                        <td className="coluna-acoes">
                          <div className="grupo-acoes">
                            <button
                              type="button"
                              className="btn-acao btn-ver"
                              onClick={() => setSelecionado(c)}
                              title="Ver detalhes do comprovante"
                            >
                              👁️ Ver
                            </button>
                            {c.status === 'pendente' && (
                              <>
                                <button
                                  type="button"
                                  className="btn-acao btn-aprovar"
                                  onClick={() => aprovar(c.id)}
                                  title="Aprovar comprovante"
                                >
                                  ✓ Aprovar
                                </button>
                                <button
                                  type="button"
                                  className="btn-acao btn-recusar"
                                  onClick={() => abrirRecusa(c.id)}
                                  title="Recusar comprovante"
                                >
                                  ✗ Recusar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {selecionado && (
        <div className="overlay" onClick={() => setSelecionado(null)}>
          <div
            className="modal modal-detalhes"
            role="dialog"
            aria-labelledby="tituloDetalhes"
            onClick={e => e.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <span className="modal-eyebrow">Comprovante {selecionado.id}</span>
                <h2 id="tituloDetalhes">Detalhes do envio</h2>
              </div>
              <button
                type="button"
                className="modal-fechar"
                aria-label="Fechar"
                onClick={() => setSelecionado(null)}
              >
                ×
              </button>
            </header>

            <div className="modal-corpo">
              <div className={`status-grande status-${selecionado.status}`}>
                <span aria-hidden="true">{STATUS_CONFIG[selecionado.status].icone}</span>
                <span>{STATUS_CONFIG[selecionado.status].label}</span>
              </div>

              <dl className="lista-detalhes">
                <div>
                  <dt>Aluno</dt>
                  <dd>{selecionado.aluno}</dd>
                </div>
                <div>
                  <dt>Matrícula</dt>
                  <dd>{selecionado.matricula}</dd>
                </div>
                <div>
                  <dt>Curso</dt>
                  <dd>{selecionado.curso}</dd>
                </div>
                <div>
                  <dt>Atividade</dt>
                  <dd>{selecionado.atividade}</dd>
                </div>
                <div>
                  <dt>Tipo</dt>
                  <dd>{selecionado.tipo === 'interna' ? 'Interna' : 'Externa'}</dd>
                </div>
                <div>
                  <dt>Carga horária</dt>
                  <dd>{selecionado.horas} horas</dd>
                </div>
                {selecionado.dataAtividade && (
                  <div>
                    <dt>Data da atividade</dt>
                    <dd>{selecionado.dataAtividade}</dd>
                  </div>
                )}
                <div>
                  <dt>Data do envio</dt>
                  <dd>{selecionado.dataEnvio}</dd>
                </div>
                {selecionado.arquivo && (
                  <div className="detalhe-full">
                    <dt>Arquivo enviado</dt>
                    <dd>
                      <div className="arquivo-acoes">
                        <button
                          type="button"
                          className="link-arquivo"
                          onClick={() => abrirArquivo(selecionado.arquivo)}
                        >
                          📎 {selecionado.arquivo.nome}
                          {selecionado.arquivo.tamanho && (
                            <span className="arquivo-tamanho">
                              {' '}({formatarTamanho(selecionado.arquivo.tamanho)})
                            </span>
                          )}
                        </button>
                        <a
                          href={selecionado.arquivo.dataUrl}
                          download={selecionado.arquivo.nome}
                          className="btn-baixar"
                        >
                          ⬇ Baixar
                        </a>
                      </div>
                    </dd>
                  </div>
                )}
                {selecionado.observacao && (
                  <div className="detalhe-full">
                    <dt>Observações do aluno</dt>
                    <dd>{selecionado.observacao}</dd>
                  </div>
                )}
                {selecionado.status === 'recusado' && selecionado.motivoRecusa && (
                  <div className="detalhe-full bloco-motivo">
                    <dt>Motivo da recusa</dt>
                    <dd>{selecionado.motivoRecusa}</dd>
                  </div>
                )}
                {selecionado.dataAvaliacao && (
                  <div className="detalhe-full">
                    <dt>Avaliado em</dt>
                    <dd>{selecionado.dataAvaliacao} por {selecionado.avaliadoPor || 'Coordenação'}</dd>
                  </div>
                )}
              </dl>
            </div>

            {selecionado.status === 'pendente' && (
              <footer className="modal-footer">
                <button
                  type="button"
                  className="btn-secundario"
                  onClick={() => { abrirRecusa(selecionado.id); setSelecionado(null); }}
                >
                  ✗ Recusar
                </button>
                <button
                  type="button"
                  className="btn-primario"
                  onClick={() => { aprovar(selecionado.id); setSelecionado(null); }}
                >
                  ✓ Aprovar comprovante
                </button>
              </footer>
            )}
          </div>
        </div>
      )}

      {modalRecusa.aberto && (
        <div className="overlay" onClick={fecharRecusa}>
          <div
            className="modal modal-recusa"
            role="dialog"
            aria-labelledby="tituloRecusa"
            onClick={e => e.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <span className="modal-eyebrow">Comprovante {modalRecusa.id}</span>
                <h2 id="tituloRecusa">Recusar comprovante</h2>
              </div>
              <button
                type="button"
                className="modal-fechar"
                aria-label="Fechar"
                onClick={fecharRecusa}
              >
                ×
              </button>
            </header>

            <div className="modal-corpo">
              <p className="texto-modal">
                Informe o motivo da recusa. Essa mensagem será enviada ao aluno para que ele possa corrigir e reenviar o comprovante.
              </p>
              <label htmlFor="motivoRecusa" className="rotulo-campo">
                Motivo da recusa
              </label>
              <textarea
                id="motivoRecusa"
                className="campo-textarea"
                placeholder="Ex.: Documento ilegível, carga horária não comprovada, certificado fora do período letivo..."
                value={modalRecusa.motivo}
                onChange={e => setModalRecusa(m => ({ ...m, motivo: e.target.value }))}
                rows={5}
                autoFocus
              />
              {!modalRecusa.motivo.trim() && (
                <span className="dica-campo">É necessário descrever o motivo para concluir a recusa.</span>
              )}
            </div>

            <footer className="modal-footer">
              <button type="button" className="btn-secundario" onClick={fecharRecusa}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn-perigo"
                disabled={!modalRecusa.motivo.trim()}
                onClick={confirmarRecusa}
              >
                Confirmar recusa
              </button>
            </footer>
          </div>
        </div>
      )}

      {toast.visivel && (
        <div className={`toast toast-${toast.tipo}`} role="status">
          {toast.mensagem}
        </div>
      )}

      <footer className="rodape">
        <p>&copy; 2026 IBMEC. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default ValidacaoComprovantes;
