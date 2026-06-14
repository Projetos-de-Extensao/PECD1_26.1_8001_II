import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr'; 
import '../css/FormInterno.css';
import Comprovante from './Comprovante.jsx';
import { apiFetch } from '../api';

export default function FormInterno({ ativo }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const requestRef = useRef(null); // Para controlar o loop de leitura
  
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [scannerStatus, setScannerStatus] = useState('');
  const [comprovanteId, setComprovanteId] = useState(null);
  
  const [dadosQr, setDadosQr] = useState({
    idEvento: '', // ID oculto para mandar pro banco
    nomePalestra: '-',
    data: '-',
    horas: '-'
  });

  // ==========================================
  // LÓGICA DO SCANNER (CÂMERA E LEITURA)
  // ==========================================
  async function startScanner() {
    try {
      setScannerStatus('Iniciando câmera...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true); // Necessário para funcionar no iOS Safari
        videoRef.current.play().catch(() => {});
        
        setScannerAtivo(true);
        setScannerStatus('Aponte a câmera para o QR Code...');
        
        // Inicia o loop para ficar checando o vídeo
        requestRef.current = requestAnimationFrame(scanearFrame);
      }
    } catch (err) {
      console.error(err);
      setScannerStatus('Erro ao acessar a câmera. Verifique as permissões.');
    }
  }

  function scanearFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Se o vídeo estiver rodando com dados suficientes
    if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      
      // Desenha o frame do vídeo no canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // O jsQR tenta achar um QR Code na imagem
      const codigoEncontrado = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (codigoEncontrado) {
        // ACHOU O QR CODE!
        console.log("Conteúdo do QR:", codigoEncontrado.data);
        processarDadosDoQrCode(codigoEncontrado.data);
        return; // Interrompe o loop
      }
    }
    
    // Se não achou, pede para checar o próximo frame
    if (scannerAtivo) {
      requestRef.current = requestAnimationFrame(scanearFrame);
    }
  }

  // Pega o texto/link do QR Code e transforma em dados
  function processarDadosDoQrCode(conteudoLido) {
    stopScanner(); // Desliga a câmera
    setScannerStatus('QR Code lido com sucesso!');

    // AQUI VOCÊ ADAPTA PARA O SEU FORMATO:
    // Se o seu QR code for um JSON ex: {"id":"123", "nome":"Design", "horas":"4", "data":"2026-05-31"}
    try {
      // Tentamos converter o texto lido para um Objeto JS
      const dadosConvertidos = JSON.parse(conteudoLido); 
      
      setDadosQr({
        idEvento: dadosConvertidos.id || 'N/A',
        nomePalestra: dadosConvertidos.nome || 'Evento Desconhecido',
        data: dadosConvertidos.data || '-',
        horas: dadosConvertidos.horas || '-'
      });
    } catch (e) {
      // Se não for JSON (for só um link ou texto simples)
      setScannerStatus('Formato de QR Code inválido ou não reconhecido.');
      console.log('O QR code lido continha o texto:', conteudoLido);
    }
  }

  function stopScanner() {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    
    setScannerAtivo(false);
  }

  useEffect(() => {
    return () => stopScanner(); // Limpeza ao sair da tela
  }, []);

  // ==========================================
  // ENVIO PARA O BANCO DE DADOS (VIA API)
  // ==========================================
  async function handleEnviarInterno() {
    if (dadosQr.nomePalestra === '-') {
      setScannerStatus('⚠ Leia um QR Code primeiro antes de enviar.');
      return;
    }

    setScannerStatus('Enviando para o banco de dados...');
    
    try {
      const usuarioSalvo = localStorage.getItem('usuario');
      if (!usuarioSalvo) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }
      const usuarioLogado = JSON.parse(usuarioSalvo);

      const resposta = await apiFetch('/api/solicitacoes/criar-interna/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',},
        body: JSON.stringify({
          evento_id: dadosQr.idEvento
        }), 
      });

      if (!resposta.ok) {
        const erroData = await resposta.json().catch(() => ({}));
        throw new Error(erroData.mensagem || 'Falha ao registrar a atividade no servidor');
      }

      const dados = await resposta.json();

      setScannerStatus('✓ Horas aprovadas e salvas no banco de dados!');
      setDadosQr({ idEvento: '', nomePalestra: '-', data: '-', horas: '-' });
      setComprovanteId(dados.id_solicitacao);
    } catch (erro) {
      console.error(erro);
      setScannerStatus(`✗ ${erro.message}`);
    }
  }

  return (
    <div id="form-interno" className={`formulario ${ativo ? 'ativo' : ''}`}>
      <div className="painel-envio">
        <h2 className="titulo-form">Seleção e Envio Interno</h2>
        
        <div className="acoes" style={{ marginBottom: '1rem' }}>
          <button id="btnLerQr" className="btn btn-principal" type="button" onClick={() => (scannerAtivo ? stopScanner() : startScanner())}>
            {scannerAtivo ? 'Parar Câmera' : 'Ler QR Code'}
          </button>
        </div>

        <p id="status" className="status" role="status" aria-live="polite">
          {scannerStatus}
        </p>

        {/* Área do Scanner */}
        <div id="scannerArea" className="scanner-area" style={{ position: 'relative' }}>
          <video id="videoScanner" ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: scannerAtivo ? 'block' : 'none' }} />
          {/* O canvas fica invisível, ele só serve para o JS ler a imagem do vídeo */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Tela de Confirmação e Envio */}
        <div id="miniTela" className="mini-tela" style={{ marginTop: '2rem' }}>
          <h3>Confirme os dados lidos</h3>
          <div className="detalhes">
            <div className="detalhe"><span className="rotulo">Palestra</span><span className="valor">{dadosQr.nomePalestra}</span></div>
            <div className="detalhe"><span className="rotulo">Data</span><span className="valor">{dadosQr.data}</span></div>
            <div className="detalhe"><span className="rotulo">Horas</span><span className="valor">{dadosQr.horas}</span></div>
          </div>
          
          <button className="btn btn-principal" type="button" onClick={handleEnviarInterno} disabled={dadosQr.nomePalestra === '-'}>
            Confirmar 
          </button>
        </div>
      </div>

      {/* MODAL DE COMPROVANTE */}
      {comprovanteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 37, 85, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }} onClick={() => setComprovanteId(null)}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '600px', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: 'slideDown 0.3s ease-out', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, color: 'var(--cor-secundaria)', fontSize: '1.2rem' }}>Comprovante de Solicitação</h3>
              <button onClick={() => setComprovanteId(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>✖</button>
            </div>
            <div style={{ overflowY: 'auto' }}>
              <Comprovante idSolicitacao={comprovanteId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

