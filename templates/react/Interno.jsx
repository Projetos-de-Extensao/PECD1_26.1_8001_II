import { useState, useRef, useEffect } from 'react';
import NavBar from './NavBar';
import '../css/interno.css';

function Interno() {
  const [lendo,     setLendo]     = useState(false);
  const [dadosQr,   setDadosQr]   = useState(null);
  const [statusMsg, setStatusMsg] = useState({ texto: '', tipo: '' });
  const [enviando,  setEnviando]  = useState(false);

  // Refs para valores usados dentro do loop assíncrono
  // (state do React não pode ser lido corretamente dentro de closures do rAF)
  const videoRef       = useRef(null);
  const streamRef      = useRef(null);
  const animationIdRef = useRef(null);
  const detectorRef    = useRef(null);
  const lendoRef       = useRef(false);

  // Limpa câmera e loop ao desmontar o componente
  useEffect(() => () => pararLeitura(), []);

  function setStatus(msg, tipo = '') {
    setStatusMsg({ texto: msg, tipo });
  }

  function parseQrText(texto) {
    try {
      const json = JSON.parse(texto);
      return {
        nome:  json.nome  || json.palestra      || '',
        dia:   json.dia   || json.data          || '',
        horas: json.horas || json.carga_horaria || '',
      };
    } catch {
      const partes = texto.split('|').map(p => p.trim());
      return { nome: partes[0] || '', dia: partes[1] || '', horas: partes[2] || '' };
    }
  }

  async function loopLeitura() {
    if (!lendoRef.current) return;

    try {
      const codigos = await detectorRef.current.detect(videoRef.current);
      if (codigos?.length > 0) {
        const dados = parseQrText(codigos[0].rawValue || '');
        if (!dados.nome || !dados.dia || !dados.horas) {
          setStatus('QR lido, mas formato inválido. Use: Nome|Dia|Horas', 'erro');
        } else {
          pararLeitura();
          setDadosQr(dados);
          setStatus('QR Code lido com sucesso.', 'sucesso');
          return;
        }
      }
    } catch {
      setStatus('Erro ao ler QR. Tente novamente.', 'erro');
    }

    animationIdRef.current = requestAnimationFrame(loopLeitura);
  }

  function pararLeitura() {
    lendoRef.current = false;
    setLendo(false);

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function iniciarLeitura() {
    setDadosQr(null);

    if (!('BarcodeDetector' in window)) {
      setStatus(
        'Seu navegador não suporta leitura nativa. Use Chrome/Edge recente ou adicione biblioteca de QR.',
        'erro'
      );
      return;
    }

    try {
      detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
    } catch {
      setStatus('Falha ao iniciar detector de QR Code.', 'erro');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      lendoRef.current = true;
      setLendo(true);
      setStatus('Câmera ativa. Aponte para o QR Code.', 'sucesso');
      loopLeitura();
    } catch {
      setStatus('Não foi possível acessar a câmera.', 'erro');
    }
  }

  async function handleEnviar() {
    if (!dadosQr) {
      setStatus('Leia um QR válido antes de enviar.', 'erro');
      return;
    }

    setEnviando(true);
    setStatus('Enviando solicitação...');

    // Substitua pelo fetch real quando o backend estiver pronto:
    // await fetch('/solicitacao/interna', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dadosQr),
    // });

    await new Promise(r => setTimeout(r, 800));
    setStatus('Solicitação enviada com sucesso.', 'sucesso');
    setEnviando(false);
  }

  return (
    <>
      <NavBar />

      <main className="container-principal">
        <section className="painel-envio" aria-labelledby="tituloEnvio">
          <h1 id="tituloEnvio" className="titulo-pagina">Seleção e Envio Interno</h1>
          <p className="subtitulo-pagina">
            Leia o QR Code da palestra para preencher automaticamente os dados e enviar sua solicitação.
          </p>

          <div className="acoes">
            <button
              id="btnLerQr"
              className="btn btn-principal"
              type="button"
              disabled={lendo}
              onClick={iniciarLeitura}
            >
              Ler QR Code
            </button>
            <button
              id="btnPararLeitura"
              className="btn btn-secundario"
              type="button"
              disabled={!lendo}
              onClick={() => { pararLeitura(); setStatus('Leitura interrompida.'); }}
            >
              Parar leitura
            </button>
          </div>

          <p
            id="status"
            className={`status${statusMsg.tipo ? ` ${statusMsg.tipo}` : ''}`}
            role="status"
            aria-live="polite"
          >
            {statusMsg.texto}
          </p>

          {/* Scanner permanece no DOM para que videoRef funcione sem ser recriado */}
          <div
            id="scannerArea"
            className={`scanner-area${lendo ? ' ativo' : ''}`}
            role="region"
            aria-label="Área de leitura de QR Code"
          >
            <video id="videoScanner" ref={videoRef} autoPlay playsInline muted />
          </div>

          {dadosQr && (
            <div id="miniTela" className="mini-tela ativa" aria-live="polite">
              <h2>Confirme os dados da palestra</h2>
              <div className="detalhes">
                <div className="detalhe">
                  <span className="rotulo">Nome da palestra</span>
                  <span className="valor">{dadosQr.nome || '-'}</span>
                </div>
                <div className="detalhe">
                  <span className="rotulo">Dia</span>
                  <span className="valor">{dadosQr.dia || '-'}</span>
                </div>
                <div className="detalhe">
                  <span className="rotulo">Horas totais</span>
                  <span className="valor">{dadosQr.horas || '-'}</span>
                </div>
              </div>
              <button
                id="btnEnviar"
                className="btn btn-principal"
                type="button"
                disabled={enviando}
                onClick={handleEnviar}
              >
                {enviando ? 'Enviando...' : 'Enviar'}
              </button>
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

export default Interno;
