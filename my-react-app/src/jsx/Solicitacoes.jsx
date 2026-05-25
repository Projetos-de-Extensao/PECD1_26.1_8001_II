import { useEffect, useRef, useState } from 'react'
import '../css/solicitacoes.css' // ajuste o caminho se necessário

export default function Solicitacoes() {
  // abas do histórico (filtros)
  const [filtroAtivo, setFiltroAtivo] = useState('todos')

  // qual formulário está visível: 'interno' | 'externo'
  const [formAtivo, setFormAtivo] = useState('interno')

  // externo -> categoria e estado do formulário
  const [categoria, setCategoria] = useState('')
  const [arquivoInfo, setArquivoInfo] = useState(null)

  // QR / scanner
  const videoRef = useRef(null)
  const [scannerAtivo, setScannerAtivo] = useState(false)
  const streamRef = useRef(null)
  const [scannerStatus, setScannerStatus] = useState('')

  // formulário externo visibilidade
  const [formExternoVisivel, setFormExternoVisivel] = useState(false)

  // --- efeitos e handlers ---

  useEffect(() => {
    setFormExternoVisivel(!!categoria)
  }, [categoria])

  // alterna formulários (botões superiores)
  function handleSelecionarForm(nome) {
    setFormAtivo(nome)
  }

  // abas do histórico
  function handleSelecionarFiltro(key) {
    setFiltroAtivo(key)
  }

  // Arquivo selecionado
  function handleArquivoChange(e) {
    const f = e.target.files?.[0] ?? null
    setArquivoInfo(f ? { name: f.name, size: f.size } : null)
  }

  function handleLimparExterno() {
    setCategoria('')
    setArquivoInfo(null)
    // reset do form via DOM (se necessário) - podes usar refs para reset completo
    const form = document.getElementById('formExterno')
    if (form) form.reset()
    setFormExternoVisivel(false)
  }

  // Simula submit; ajuste para chamar API
  function handleEnviarExterno(e) {
    e.preventDefault()
    // coletar dados e enviar (ex: fetch / axios)
    setTimeout(() => {
      const nome = document.getElementById('curso')?.value ?? ''
      setScannerStatus(`Solicitação enviada: ${nome}`)
    }, 600)
  }

  // ---------- scanner (video) ----------
  async function startScanner() {
    try {
      setScannerStatus('Iniciando câmera...')
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(()=>{})
      }
      setScannerAtivo(true)
      setScannerStatus('Scanner ativo')
      // Observação: decodificação do QR não está implementada aqui — use libraries (jsQR, @zxing/library)
    } catch (err) {
      console.error(err)
      setScannerStatus('Erro ao acessar câmera')
    }
  }

  function stopScanner() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      try { videoRef.current.pause() } catch {}
      videoRef.current.srcObject = null
    }
    setScannerAtivo(false)
    setScannerStatus('')
  }

  useEffect(() => {
    // cleanup on unmount
    return () => stopScanner()
  }, [])

  // ---------- UI render ----------
  return (
    <main className="container-principal solicitacoes-page">
      <div className="layout-dual">
        <aside className="coluna-historico">
          <div className="header-historico">
            <h1 className="titulo-historico">Histórico</h1>
            <p className="subtitulo-historico">Suas solicitações</p>
          </div>

          <div className="abas-filtro" role="tablist" aria-label="Filtros de histórico">
            <button
              className={`aba-btn ${filtroAtivo === 'todos' ? 'aba-ativo' : ''}`}
              data-filtro="todos"
              onClick={() => handleSelecionarFiltro('todos')}
            >
              <span>Todas</span>
              <span className="aba-count">6</span>
            </button>

            <button
              className={`aba-btn ${filtroAtivo === 'aprovado' ? 'aba-ativo' : ''}`}
              data-filtro="aprovado"
              onClick={() => handleSelecionarFiltro('aprovado')}
            >
              <span>✓ Aprovadas</span>
              <span className="aba-count">3</span>
            </button>

            <button
              className={`aba-btn ${filtroAtivo === 'progresso' ? 'aba-ativo' : ''}`}
              data-filtro="progresso"
              onClick={() => handleSelecionarFiltro('progresso')}
            >
              <span>⏳ Progresso</span>
              <span className="aba-count">2</span>
            </button>

            <button
              className={`aba-btn ${filtroAtivo === 'recusado' ? 'aba-ativo' : ''}`}
              data-filtro="recusado"
              onClick={() => handleSelecionarFiltro('recusado')}
            >
              <span>✗ Recusadas</span>
              <span className="aba-count">1</span>
            </button>
          </div>

          <div className="tabela-wrapper">
            <table className="tabela-historico" role="table">
              <thead>
                <tr>
                  <th scope="col">Tipo</th>
                  <th scope="col">Atividade</th>
                  <th scope="col">Data</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Exemplo estático — substitua por dados reais */}
                <tr>
                  <td><span className="tipo-badge interno-badge">Interna</span></td>
                  <td>Workshop: Design Thinking</td>
                  <td>15/04</td>
                  <td><span className="status-badge status-aprovado">✓ Aprovado</span></td>
                </tr>
                <tr>
                  <td><span className="tipo-badge externo-badge">Externa</span></td>
                  <td>Palestra: Inovação</td>
                  <td>10/04</td>
                  <td><span className="status-badge status-aprovado">✓ Aprovado</span></td>
                </tr>
                <tr>
                  <td><span className="tipo-badge interno-badge">Interna</span></td>
                  <td>Curso: Python</td>
                  <td>08/04</td>
                  <td><span className="status-badge status-aprovado">✓ Aprovado</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </aside>

        {/* COLUNA DIREITA: Formulários */}
        <section className="coluna-formularios">
          {/* Botões de navegação entre formulários */}
          <div className="botoes-navegacao" role="tablist" aria-label="Selecionar formulário">
            <button
              className={`btn-nav ${formAtivo === 'interno' ? 'ativo' : ''}`}
              data-form="interno"
              onClick={() => handleSelecionarForm('interno')}
            >
              <span className="texto">Interna</span>
            </button>

            <button
              className={`btn-nav ${formAtivo === 'externo' ? 'ativo' : ''}`}
              data-form="externo"
              onClick={() => handleSelecionarForm('externo')}
            >
              <span className="texto">Externa</span>
            </button>
          </div>

          {/* FORMULÁRIO INTERNO */}
          <div id="form-interno" className={`formulario ${formAtivo === 'interno' ? 'ativo' : ''}`}>
            <div className="painel-envio">
              <h2 className="titulo-form">Seleção e Envio Interno</h2>
              <p className="subtitulo-form">Leia o QR Code para preencher automaticamente</p>

              <div className="acoes">
                <button
                  id="btnLerQr"
                  className="btn btn-principal"
                  type="button"
                  onClick={() => (scannerAtivo ? stopScanner() : startScanner())}
                >
                  {scannerAtivo ? 'Parar' : 'Ler QR Code'}
                </button>
              </div>

              <p id="status" className="status" role="status" aria-live="polite">{scannerStatus}</p>

              <div id="scannerArea" className="scanner-area">
                <video id="videoScanner" ref={videoRef} autoPlay playsInline muted />
              </div>

              <div id="miniTela" className="mini-tela">
                <h3>Confirme os dados</h3>
                <div className="detalhes">
                  <div className="detalhe">
                    <span className="rotulo">Palestra</span>
                    <span id="valorNome" className="valor">-</span>
                  </div>
                  <div className="detalhe">
                    <span className="rotulo">Data</span>
                    <span id="valorDia" className="valor">-</span>
                  </div>
                  <div className="detalhe">
                    <span className="rotulo">Horas</span>
                    <span id="valorHoras" className="valor">-</span>
                  </div>
                </div>
                <button id="btnEnviarInterno" className="btn btn-principal" type="button" onClick={() => setScannerStatus('Enviado (simulado)')}>
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO EXTERNO */}
          <div id="form-externo" className={`formulario ${formAtivo === 'externo' ? 'ativo' : ''}`}>
            <div className="painel-envio">
              <h2 className="titulo-form">Solicitação Externa</h2>
              <p className="subtitulo-form">Envie documentos de eventos externos</p>

              <div className="campo-select-wrapper">
                <label htmlFor="categoria">Categoria</label>
                <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="">— Escolha uma categoria —</option>
                  <option value="palestra">Palestra</option>
                  <option value="workshop">Workshop</option>
                  <option value="curso">Curso</option>
                </select>
              </div>

              <form id="formExterno" className={`form-oculto ${formExternoVisivel ? '' : ''}`} onSubmit={handleEnviarExterno} noValidate>
                <div className="form-rows">
                  <div className="campo">
                    <label htmlFor="curso">Título</label>
                    <input id="curso" name="curso" type="text" placeholder="Nome do evento" required />
                  </div>

                  <div className="campo">
                    <label htmlFor="data">Data</label>
                    <input id="data" name="data" type="date" required />
                  </div>

                  <div className="campo">
                    <label htmlFor="duracao">Horas</label>
                    <input id="duracao" name="duracao" type="number" min="0" step="0.5" required />
                  </div>

                  <div className="campo">
                    <label htmlFor="arquivo">PDF</label>
                    <input id="arquivo" name="arquivo" type="file" accept="application/pdf" onChange={handleArquivoChange} />
                    <div id="nomeArquivo" className="arquivo-info">{arquivoInfo ? arquivoInfo.name : ''}</div>
                  </div>
                </div>

                <div className="acoes">
                  <button id="btnEnviar" type="submit" className="btn btn-principal">Enviar</button>
                  <button id="btnLimpar" type="button" className="btn btn-secundario" onClick={handleLimparExterno}>Limpar</button>
                </div>
              </form>

              <div id="mensagem" role="status" aria-live="polite">{scannerStatus}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}