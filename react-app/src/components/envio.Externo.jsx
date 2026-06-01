          <><div className="campo-select-wrapper">
    <label htmlFor="categoria">Categoria</label>
    <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        <option value="">— Escolha uma categoria —</option>
        <option value="palestra">Palestra</option>
        <option value="workshop">Workshop</option>
        <option value="curso">Curso</option>
    </select>
</div><form id="formExterno" className={`form-oculto ${formExternoVisivel ? '' : ''}`} onSubmit={handleEnviarExterno} noValidate>
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
    </form></>