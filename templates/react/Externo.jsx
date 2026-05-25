import { useState, useRef, useEffect } from 'react';
import NavBar from './NavBar';
import '../css/interno.css';
import '../css/externo.css';

const CATEGORIAS = [
  { value: 'palestra',  label: 'Palestra'  },
  { value: 'workshop',  label: 'Workshop'  },
  { value: 'curso',     label: 'Curso'     },
];

function Externo() {
  const [categoria,    setCategoria]    = useState('');
  const [curso,        setCurso]        = useState('');
  const [data,         setData]         = useState('');
  const [duracao,      setDuracao]      = useState('');
  const [arquivo,      setArquivo]      = useState(null);
  const [nomeArquivo,  setNomeArquivo]  = useState('');
  const [mensagem,     setMensagem]     = useState({ texto: '', tipo: '' });
  const [enviando,     setEnviando]     = useState(false);

  const arquivoRef  = useRef(null);
  const mensagemRef = useRef(null);

  useEffect(() => {
    if (mensagem.texto && mensagemRef.current) {
      mensagemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [mensagem]);

  function handleCategoria(e) {
    setCategoria(e.target.value);
    setMensagem({ texto: '', tipo: '' });
  }

  function handleArquivo(e) {
    const f = e.target.files[0];
    if (f) {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(2);
      setArquivo(f);
      setNomeArquivo(`✓ ${f.name} (${sizeMB} MB)`);
    } else {
      setArquivo(null);
      setNomeArquivo('');
    }
  }

  function handleLimpar() {
    setCurso('');
    setData('');
    setDuracao('');
    setArquivo(null);
    setNomeArquivo('');
    setMensagem({ texto: '', tipo: '' });
    if (arquivoRef.current) arquivoRef.current.value = '';
  }

  function resetForm() {
    setCurso('');
    setData('');
    setDuracao('');
    setArquivo(null);
    setNomeArquivo('');
    setCategoria('');
    if (arquivoRef.current) arquivoRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    if (!curso.trim() || !data || !parseFloat(duracao || 0) || !arquivo) {
      setMensagem({ texto: 'Preencha todos os campos e anexe um PDF.', tipo: 'error' });
      return;
    }

    if (arquivo.type !== 'application/pdf' && !arquivo.name.toLowerCase().endsWith('.pdf')) {
      setMensagem({ texto: 'O arquivo precisa ser um PDF válido.', tipo: 'error' });
      return;
    }

    if (arquivo.size > 8 * 1024 * 1024) {
      setMensagem({ texto: 'Arquivo muito grande (máximo 8MB).', tipo: 'error' });
      return;
    }

    setEnviando(true);

    const fd = new FormData();
    fd.append('categoria', categoria);
    fd.append('curso',     curso.trim());
    fd.append('data',      data);
    fd.append('duracao',   parseFloat(duracao));
    fd.append('arquivo',   arquivo);

    try {
      const resp = await fetch('/solicitacao/externa', { method: 'POST', body: fd });

      if (resp.ok) {
        setMensagem({ texto: '✓ Solicitação enviada com sucesso!', tipo: 'success' });
        resetForm();
      } else {
        const txt = await resp.text().catch(() => resp.statusText);
        setMensagem({ texto: `Erro: ${txt}`, tipo: 'error' });
      }
    } catch {
      setMensagem({ texto: 'Erro de conexão. Verifique sua internet e tente novamente.', tipo: 'error' });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <NavBar />

      <main className="container-principal">
        <section className="painel-envio" aria-labelledby="tituloExterna">
          <h1 id="tituloExterna" className="titulo-pagina">Solicitação Externa</h1>
          <p className="subtitulo-pagina">
            Selecione uma categoria, preencha os dados e envie seu documento.
          </p>

          <div className="campo-select-wrapper">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              value={categoria}
              onChange={handleCategoria}
              aria-describedby="categoriaHelp"
            >
              <option value="">— Escolha uma categoria —</option>
              {CATEGORIAS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <p id="categoriaHelp" className="ajuda">
              Selecione a categoria antes de preencher o formulário.
            </p>
          </div>

          {categoria && (
            <form
              id="formExterno"
              encType="multipart/form-data"
              noValidate
              onSubmit={handleSubmit}
              style={{ marginTop: '1.25rem' }}
            >
              <div className="form-rows">
                <div className="campo">
                  <label htmlFor="curso">Curso / Título</label>
                  <input
                    id="curso"
                    name="curso"
                    type="text"
                    placeholder="Nome da palestra ou curso"
                    value={curso}
                    onChange={e => setCurso(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="campo">
                  <label htmlFor="data">Data</label>
                  <input
                    id="data"
                    name="data"
                    type="date"
                    value={data}
                    onChange={e => setData(e.target.value)}
                    required
                  />
                </div>

                <div className="campo">
                  <label htmlFor="duracao">Duração (horas)</label>
                  <input
                    id="duracao"
                    name="duracao"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="Ex: 2.5"
                    value={duracao}
                    onChange={e => setDuracao(e.target.value)}
                    required
                  />
                </div>

                <div className="campo">
                  <label htmlFor="arquivo">Documento (PDF)</label>
                  <input
                    id="arquivo"
                    name="arquivo"
                    type="file"
                    accept="application/pdf"
                    ref={arquivoRef}
                    onChange={handleArquivo}
                    required
                  />
                  {nomeArquivo && (
                    <div className="arquivo-info" aria-live="polite">{nomeArquivo}</div>
                  )}
                </div>
              </div>

              <div className="acoes">
                <button
                  id="btnEnviar"
                  type="submit"
                  className="btn btn-principal"
                  disabled={enviando}
                >
                  {enviando ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
                <button
                  id="btnLimpar"
                  type="button"
                  className="btn btn-secundario"
                  onClick={handleLimpar}
                >
                  Limpar
                </button>
              </div>
            </form>
          )}

          {mensagem.texto && (
            <div
              ref={mensagemRef}
              id="mensagem"
              role="status"
              aria-live="polite"
              className={mensagem.tipo}
            >
              {mensagem.texto}
            </div>
          )}
        </section>
      </main>

      <footer className="rodape">
        <p>&copy; 2026 IBMEC. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default Externo;
