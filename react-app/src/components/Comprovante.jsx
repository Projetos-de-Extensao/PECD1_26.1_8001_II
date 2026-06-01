import React, { useState } from 'react'
import '../styles/comprovante.css'

const CODIGOS_VALIDOS = ['AAC-2026-0558', 'CERT-IB-12345', 'AAC-VAL-001']
const DETALHES = [
  { label: 'Número do comprovante', valor: 'AAC-2026-0558' },
  { label: 'Quantidade enviada', valor: '3 certificados' },
  { label: 'Plataforma de envio', valor: 'Portal AAC IBMEC' },
  { label: 'Observações', valor: 'Envio concluído com sucesso. Aguarde a validação do setor.' }
]

export default function Comprovante() {
  const [codigo, setCodigo] = useState('')
  const [validacao, setValidacao] = useState({ status: 'Pendente', msg: 'O comprovante ainda não foi validado pelo portal.', erro: '', resultado: null, isValidando: false })

  function handleSubmit(e) {
    e.preventDefault()
    const c = codigo.trim()
    if (!c) {
      setValidacao(v => ({ ...v, erro: 'Informe o código do comprovante.', resultado: { type: 'erro', msg: 'Preencha o código para verificar o comprovante.' } }))
      return
    }

    setValidacao(v => ({ ...v, isValidando: true, erro: '', resultado: null }))
    setTimeout(() => {
      const valido = CODIGOS_VALIDOS.includes(c)
      setValidacao({
        status: valido ? 'Validado' : 'Inválido',
        msg: valido ? 'O comprovante é válido e o envio dos certificados foi confirmado.' : 'O código não foi reconhecido. Verifique e tente novamente.',
        erro: '',
        resultado: { type: valido ? 'sucesso' : 'erro', msg: valido ? 'Comprovante validado com sucesso.' : 'Código de comprovante inválido.' },
        isValidando: false
      })
    }, 900)
  }

  return (
    <div className="pagina">
      <div className="cartao">
        <div className="logo">
          <div className="caixa-logo">I</div>
          <span>IBMEC</span>
        </div>

        <h1>Comprovante de envio</h1>
        <p className="subtitulo">Confira o status do envio dos certificados e valide o comprovante.</p>

        <section className="resumo">
          <div className="bloco-status">
            <span className="rotulo">Status atual</span>
            <strong>{validacao.status}</strong>
            <p className="texto-status">{validacao.msg}</p>
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

        <section className="detalhes">
          <h2>Detalhes do comprovante</h2>
          <dl>
            {DETALHES.map((item, i) => (
              <div key={i}>
                <dt>{item.label}</dt>
                <dd>{item.valor}</dd>
              </div>
            ))}
          </dl>
        </section>

        <form onSubmit={handleSubmit} noValidate>
          <div className="campo">
            <label htmlFor="codigoComprovante">Código para validação</label>
            <input
              type="text"
              id="codigoComprovante"
              placeholder="Digite o código do comprovante"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
            />
            <span className="erro">{validacao.erro}</span>
          </div>

          <button type="submit" id="botaoValidar" disabled={validacao.isValidando}>
            {validacao.isValidando ? 'Validando...' : 'Validar comprovante'}
          </button>

          {validacao.resultado && (
            <p className={`retorno ${validacao.resultado.type === 'erro' ? 'erro' : 'sucesso'}`}>
              {validacao.resultado.msg}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
