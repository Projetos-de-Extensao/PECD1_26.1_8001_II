import NavBar from './NavBar';
import '../css/dashboard.css';

const RAIO = 40;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

const HORAS = {
  total:    { atual: 80,  meta: 120 },
  internas: { atual: 50,  meta: 60  },
  externas: { atual: 30,  meta: 60  },
};

const ATIVIDADES = [
  { tipo: 'Interna', nome: 'Workshop: Design Thinking',          data: '15/04/2026', horas: '4h' },
  { tipo: 'Externa', nome: 'Palestra: Inovação Disruptiva',      data: '10/04/2026', horas: '2h' },
  { tipo: 'Interna', nome: 'Curso: Python Avançado',             data: '08/04/2026', horas: '8h' },
  { tipo: 'Externa', nome: 'Seminário: Empreendedorismo',        data: '05/04/2026', horas: '3h' },
  { tipo: 'Interna', nome: 'Mentoria: Liderança',                data: '02/04/2026', horas: '2h' },
  { tipo: 'Externa', nome: 'Congresso: Tecnologia e Sociedade',  data: '28/03/2026', horas: '6h' },
];

function pct(atual, meta) {
  return Math.round((atual / meta) * 100);
}

function Dashboard() {
  const totalPct    = pct(HORAS.total.atual,    HORAS.total.meta);
  const internasPct = pct(HORAS.internas.atual, HORAS.internas.meta);
  const externasPct = pct(HORAS.externas.atual, HORAS.externas.meta);

  const internasDash = (internasPct / 100) * CIRCUNFERENCIA;
  const externasDash = (externasPct / 100) * CIRCUNFERENCIA;

  return (
    <>
      <NavBar />

      <main className="container-principal">
        <section className="dashboard-container">
          <h1 className="titulo-dashboard">Sistema De Controle de Horas</h1>

          <div className="card-principal">
            <div className="card-header">
              <h2 className="card-titulo-grande">Suas Horas</h2>
              <div className="total-info">
                <span className="total-horas">
                  {HORAS.total.atual} / {HORAS.total.meta} horas
                </span>
                <span className="total-percentual">{totalPct}%</span>
              </div>
            </div>

            <div className="progresso-geral">
              <div className="barra-progresso">
                <div className="progresso-preenchido" style={{ width: `${totalPct}%` }} />
              </div>
            </div>

            <div className="horas-comparacao">
              <div className="tipo-hora interno">
                <div className="header-tipo">
                  <h3 className="titulo-tipo">Internas</h3>
                </div>
                <div className="valor-tipo">
                  {HORAS.internas.atual} / {HORAS.internas.meta} horas
                </div>
                <div className="barra-tipo">
                  <div
                    className="preenchimento-tipo"
                    style={{
                      width: `${internasPct}%`,
                      background: 'linear-gradient(90deg, #F5AC00, #ffb84d)',
                    }}
                  />
                </div>
                <div className="percentual-tipo">{internasPct}%</div>
              </div>

              <div className="tipo-hora externo">
                <div className="header-tipo">
                  <h3 className="titulo-tipo">Externas</h3>
                </div>
                <div className="valor-tipo">
                  {HORAS.externas.atual} / {HORAS.externas.meta} horas
                </div>
                <div className="barra-tipo">
                  <div
                    className="preenchimento-tipo"
                    style={{
                      width: `${externasPct}%`,
                      background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
                    }}
                  />
                </div>
                <div className="percentual-tipo">{externasPct}%</div>
              </div>
            </div>

            <div className="visualizacao-visual">
              <svg viewBox="0 0 100 100" className="donut-chart">
                <circle
                  cx="50" cy="50" r={RAIO}
                  fill="none" stroke="#e0e0e0" strokeWidth="15"
                />
                <circle
                  cx="50" cy="50" r={RAIO}
                  fill="none" stroke="#F5AC00" strokeWidth="15"
                  strokeDasharray={`${internasDash} ${CIRCUNFERENCIA}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="arc-interno"
                />
                <circle
                  cx="50" cy="50" r={RAIO}
                  fill="none" stroke="#6366f1" strokeWidth="15"
                  strokeDasharray={`${externasDash} ${CIRCUNFERENCIA}`}
                  strokeDashoffset={-internasDash}
                  strokeLinecap="round"
                  className="arc-externo"
                />
              </svg>

              <div className="legenda-visual">
                <div className="legenda-item">
                  <span className="legenda-cor interno" />
                  <span className="legenda-texto">Internas</span>
                </div>
                <div className="legenda-item">
                  <span className="legenda-cor externo" />
                  <span className="legenda-texto">Externas</span>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                {ATIVIDADES.map((atividade, i) => (
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
      </main>

      <footer className="rodape">
        <p>&copy; 2026 IBMEC. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default Dashboard;
