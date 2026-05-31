import React, { useState, useEffect } from 'react';

function DashboardGeral() {
  // 1. Estados para guardar os dados da API e controlar o carregamento
  const [horas, setHoras] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // 2. Busca os dados da API quando o componente é montado
  useEffect(() => {
    async function buscarDadosDashboard() {
      try {
        // Substitua pela URL real da sua API
        const resp = await fetch('/api/dashboard-horas'); 
        
        if (!resp.ok) {
          throw new Error('Falha ao carregar as horas do dashboard');
        }

        const dados = await resp.json();
        setHoras(dados); // Salva os dados no estado

      } catch (error) {
        console.error('Erro na API:', error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    buscarDadosDashboard();
  }, []);

  // 3. Telas de Carregamento e Erro
  if (carregando) {
    return (
      <main className="container-principal">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando dashboard...</p>
      </main>
    );
  }

  if (erro || !horas) {
    return (
      <main className="container-principal">
        <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Ocorreu um erro ao carregar o dashboard. Tente novamente mais tarde.
        </p>
      </main>
    );
  }

  // 4. Cálculos Matemáticos (Feitos APÓS os dados chegarem da API)
  const totalPct = Math.round((horas.total.atual / horas.total.meta) * 100);
  const internasPct = Math.round((horas.internas.atual / horas.internas.meta) * 100);
  const externasPct = Math.round((horas.externas.atual / horas.externas.meta) * 100);

  // Cálculos para o Gráfico de Donut (SVG)
  const RAIO = 40;
  const CIRCUNFERENCIA = 2 * Math.PI * RAIO;
  
  // Calcula o preenchimento no círculo com base na meta total
  const internasDash = (horas.internas.atual / horas.total.meta) * CIRCUNFERENCIA;
  const externasDash = (horas.externas.atual / horas.total.meta) * CIRCUNFERENCIA;

  // 5. Renderização do Layout
  return (
    <>
      <main className="container-principal">
        <section className="dashboard-container">
          <h1 className="titulo-dashboard">Sistema De Controle de Horas</h1>

          <div className="card-principal">
            <div className="card-header">
              <h2 className="card-titulo-grande">Suas Horas</h2>
              <div className="total-info">
                <span className="total-horas">
                  {horas.total.atual} / {horas.total.meta} horas
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
              {/* Card Internas */}
              <div className="tipo-hora interno">
                <div className="header-tipo">
                  <h3 className="titulo-tipo">Internas</h3>
                </div>
                <div className="valor-tipo">
                  {horas.internas.atual} / {horas.internas.meta} horas
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

              {/* Card Externas */}
              <div className="tipo-hora externo">
                <div className="header-tipo">
                  <h3 className="titulo-tipo">Externas</h3>
                </div>
                <div className="valor-tipo">
                  {horas.externas.atual} / {horas.externas.meta} horas
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

            {/* Gráfico Donut */}
            <div className="visualizacao-visual">
              <svg viewBox="0 0 100 100" className="donut-chart">
                {/* Fundo do círculo */}
                <circle
                  cx="50" cy="50" r={RAIO}
                  fill="none" stroke="#e0e0e0" strokeWidth="15"
                />
                {/* Arco de Horas Internas */}
                <circle
                  cx="50" cy="50" r={RAIO}
                  fill="none" stroke="#F5AC00" strokeWidth="15"
                  strokeDasharray={`${internasDash} ${CIRCUNFERENCIA}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="arc-interno"
                />
                {/* Arco de Horas Externas (Começa onde o interno termina) */}
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
                  <span className="legenda-cor interno" style={{ backgroundColor: '#F5AC00', width: '12px', height: '12px', display: 'inline-block', borderRadius: '50%', marginRight: '8px' }} />
                  <span className="legenda-texto">Internas</span>
                </div>
                <div className="legenda-item">
                  <span className="legenda-cor externo" style={{ backgroundColor: '#6366f1', width: '12px', height: '12px', display: 'inline-block', borderRadius: '50%', marginRight: '8px' }} />
                  <span className="legenda-texto">Externas</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}

export default DashboardGeral;