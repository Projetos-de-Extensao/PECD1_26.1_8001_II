export function TabelaHistorico({ atividades }) {
  return (
    <section className="atividades-container">
      <h2 className="titulo-secao">Atividades Aprovadas</h2>
      <div className="tabela-wrapper">
        <table className="tabela-atividades" role="table">
          <thead>
            <tr>
              <th scope="col">Tipo</th>
              <th scope="col">Nome da Atividade</th>
              <th scope="col">Data</th>
              <th scope="col">Horas</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {atividades.map((atividade, i) => (
              <tr key={i} className="linha-atividade">
                <td>
                  <span className={`tipo-badge ${atividade.tipo === 'Interna' ? 'interno-badge' : 'externo-badge'}`}>
                    {atividade.tipo}
                  </span>
                </td>
                <td className="nome-atividade">{atividade.nome}</td>
                <td className="data">{atividade.data}</td>
                <td className="horas">{atividade.horas}</td>
                <td className="status aprovado">✓ Aprovado</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}