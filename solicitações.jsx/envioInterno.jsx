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