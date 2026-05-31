export function GraficoHoras({ HORAS, totalPct, internasPct, externasPct, internasDash, externasDash }) {
  return (
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
  )
}