import { useState } from 'react';
import '../css/comprovante.css';

const CODIGOS_VALIDOS = ['AAC-2026-0558', 'CERT-IB-12345', 'AAC-VAL-001'];

const STATUS_INICIAL = {
  texto: 'Pendente',
  descricao: 'O comprovante ainda não foi validado pelo portal.',
};

function Comprovante() {
  const [status, setStatus] = useState(STATUS_INICIAL);
  const [codigo, setCodigo] = useState('');
  const [erroCodigo, setErroCodigo] = useState('');
  const [validando, setValidando] = useState(false);
  const [retorno, setRetorno] = useState({ tipo: 'oculto', mensagem: '' });

  function handleSubmit(e) {
    e.preventDefault();

    const codigoTrimmed = codigo.trim();
    if (!codigoTrimmed) {
      setErroCodigo('Informe o código do comprovante.');
      setRetorno({ tipo: 'erro', mensagem: 'Preencha o código para verificar o comprovante.' });
      return;
    }

    setErroCodigo('');
    setValidando(true);
    setRetorno({ tipo: 'oculto', mensagem: '' });

    setTimeout(() => {
      const valido = CODIGOS_VALIDOS.includes(codigoTrimmed);

      if (valido) {
        setStatus({
          texto: 'Validado',
          descricao: 'O comprovante é válido e o envio dos certificados foi confirmado.',
        });
        setRetorno({ tipo: 'sucesso', mensagem: 'Comprovante validado com sucesso.' });
      } else {
        setStatus({
          texto: 'Inválido',
          descricao: 'O código não foi reconhecido. Verifique e tente novamente.',
        });
        setRetorno({ tipo: 'erro', mensagem: 'Código de comprovante inválido.' });
      }

      setValidando(false);
    }, 900);
  }

  return (
    <div className="pagina">
      <div className="cartao">
        <div className="logo">
          <div className="caixa-logo">I</div>
          <span>IBMEC</span>
        </div>

        <h1>Comprovante de envio</h1>
        <p className="subtitulo">
          Confira o status do envio dos certificados e valide o comprovante.
        </p>

        <section className="resumo">
          <div className="bloco-status">
            <span className="rotulo">Status atual</span>
            <strong>{status.texto}</strong>
            <p className="texto-status">{status.descricao}</p>
          </div>
          <div className="bloco-infos">
            <div>
              <span className="rotulo">Data do envio</span>
              <strong>03/05/2026</strong>
            </div>
            <div>
              <span className="rotulo">Tipo de certificado</span>
              <strong>Certificados AAC</strong>
            </div>
          </div>
        </section>

        <form id="formularioValidacao" onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="codigoComprovante">Código do comprovante</label>
            <input
              id="codigoComprovante"
              type="text"
              placeholder="Ex: AAC-2026-0558"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            {erroCodigo && <span className="erro">{erroCodigo}</span>}
          </div>

          <button type="submit" disabled={validando}>
            {validando ? 'Validando...' : 'Validar comprovante'}
          </button>

          {retorno.tipo !== 'oculto' && (
            <div className={`retorno ${retorno.tipo}`}>
              {retorno.mensagem}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Comprovante;
