<aside>                                        
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
        {(filtroAtivo === 'todos' || filtroAtivo === 'aprovado') && (
          <tr>
            <td><span className="tipo-badge interno-badge">Interna</span></td>
            <td>Workshop: Design Thinking</td>
            <td>15/04</td>
            <td><span className="status-badge status-aprovado">✓ Aprovado</span></td>
          </tr>
        )}
        {(filtroAtivo === 'todos' || filtroAtivo === 'aprovado') && (
          <tr>
            <td><span className="tipo-badge externo-badge">Externa</span></td>
            <td>Palestra: Inovação</td>
            <td>10/04</td>
            <td><span className="status-badge status-aprovado">✓ Aprovado</span></td>
          </tr>
        )}
        {(filtroAtivo === 'todos' || filtroAtivo === 'aprovado') && (
          <tr>
            <td><span className="tipo-badge interno-badge">Interna</span></td>
            <td>Curso: Python</td>
            <td>08/04</td>
            <td><span className="status-badge status-aprovado">✓ Aprovado</span></td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</aside>