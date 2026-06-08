import React, { useState, useEffect } from 'react';
import '../css/dashboardGeral.css';

function DashboardGeral() {
  // 1. Declaração dos Estados
  const [carregando, setCarregando] = useState(true);
  const [horas, setHoras] = useState({
    total: { atual: 0, meta: 120 },
    internas: { atual: 0, meta: 60 },
    externas: { atual: 0, meta: 60 }
  });

  // 2. Busca dos Dados na API
  useEffect(() => {
    async function buscarDadosDashboard() {
      setCarregando(true);
      try {
        const usuarioSalvo = localStorage.getItem('usuario');
        if (!usuarioSalvo) {
          throw new Error('Usuário não autenticado');
        }
        const usuarioLogado = JSON.parse(usuarioSalvo);

        const resp = await fetch('http://localhost:8000/api/usuarios/horas-totais/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Usuario-Matricula': usuarioLogado.matricula
          }
        }); 
        
        if (!resp.ok) throw new Error('Falha na API');

        const dados = await resp.json();
        
        setHoras({
          total: { atual: dados.horas_totais || 0, meta: dados.meta_total || 120 },
          internas: { atual: dados.horas_internas || 0, meta: dados.meta_internas || 60 },
          externas: { atual: dados.horas_externas || 0, meta: dados.meta_externas || 60 }
        });

      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        
        setHoras({
          total: { atual: 0, meta: 120 },
          internas: { atual: 0, meta: 60 },
          externas: { atual: 0, meta: 60 }
        });
      } finally {
        setCarregando(false);
      }
    }

    buscarDadosDashboard();
  }, []);

  // 3. Renderização Condicional de Carregamento
  if (carregando) {
    return (
      <main className="container-principal" style={{ paddingTop: '1rem', minHeight: 'auto' }}>
        <p style={{textAlign: 'center', padding: '2rem', color: '#fff'}}>Carregando seu progresso...</p>
      </main>
    );
  }

  // 4. Cálculos Matemáticos (Feitos APÓS os dados chegarem da API)
  const totalPct = Math.min(100, Math.round((horas.total.atual / horas.total.meta) * 100));
  const internasPct = Math.min(100, Math.round((horas.internas.atual / horas.internas.meta) * 100));
  const externasPct = Math.min(100, Math.round((horas.externas.atual / horas.externas.meta) * 100));

  // Cálculos para o Gráfico de Donut (SVG)
  const RAIO = 40;
  const CIRCUNFERENCIA = 2 * Math.PI * RAIO;
  
  const totalMetaSafe = horas.total.meta || 1; // Evita divisão por zero
  const internasDash = (horas.internas.atual / totalMetaSafe) * CIRCUNFERENCIA;
  const externasDash = (horas.externas.atual / totalMetaSafe) * CIRCUNFERENCIA;

  // 5. Renderização do Layout
  return (
    <>
      <main className="container-principal" style={{ paddingTop: '1rem', minHeight: 'auto' }}>
        <section className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* PAINEL GLASSMORPHISM */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* TOPO: PROGRESSO GERAL E DONUT */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* INFORMAÇÕES GERAIS */}
              <div style={{ flex: '1 1 280px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff' }}>Seu Progresso AAC</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem' }}>
                  Acompanhe a distribuição das suas horas complementares e fique de olho na sua meta para a formatura.
                </p>
                
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: '600' }}>Total Acumulado</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', lineHeight: '1' }}>{horas.total.atual}</span>
                      <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}> / {horas.total.meta}h</span>
                    </div>
                  </div>
                  <div className="barra-progresso" style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div 
                      className="progresso-preenchido" 
                      style={{ 
                        width: `${totalPct}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                        borderRadius: '10px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} 
                    />
                  </div>
                  <div style={{ marginTop: '0.8rem', textAlign: 'right', fontSize: '1rem', color: '#38bdf8', fontWeight: '700' }}>
                    {totalPct}% Concluído
                  </div>
                </div>
              </div>

              {/* GRÁFICO DONUT */}
              <div style={{ flex: '0 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r={RAIO} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    
                    {/* Arco Externas (Roxo) */}
                    <circle cx="50" cy="50" r={RAIO} fill="none" stroke="#a78bfa" strokeWidth="12" strokeDasharray={`${externasDash} ${CIRCUNFERENCIA}`} strokeDashoffset="0" strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease-out' }} />
                    
                    {/* Arco Internas (Laranja/Amarelo) */}
                    <circle cx="50" cy="50" r={RAIO} fill="none" stroke="#F5AC00" strokeWidth="12" strokeDasharray={`${internasDash} ${CIRCUNFERENCIA}`} strokeDashoffset={-externasDash} strokeLinecap="round" style={{ transition: 'all 1s ease-out' }} />
                  </svg>
                  {/* Texto no centro do Donut */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', lineHeight: '1' }}>{horas.total.atual}</span>
                    <span style={{ fontSize: '0.9rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px' }}>Horas</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F5AC00', display: 'inline-block' }}></span>
                    <span style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>Internas</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#a78bfa', display: 'inline-block' }}></span>
                    <span style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>Externas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PARTE INFERIOR: CARDS DETALHADOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              {/* CARD INTERNAS */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(245, 172, 0, 0.2)', padding: '0.8rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '1.5rem' }}>🏛️</span>
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Atividades Internas</h3>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Eventos no Campus / IBMEC</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F5AC00' }}>{horas.internas.atual} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '600' }}>/ {horas.internas.meta}h</span></span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>{internasPct}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${internasPct}%`, height: '100%', background: '#F5AC00', borderRadius: '10px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </div>
                </div>
              </div>

              {/* CARD EXTERNAS */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(167, 139, 250, 0.2)', padding: '0.8rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '1.5rem' }}>🌍</span>
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Atividades Externas</h3>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Cursos, Palestras e Outros</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#a78bfa' }}>{horas.externas.atual} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '600' }}>/ {horas.externas.meta}h</span></span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>{externasPct}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${externasPct}%`, height: '100%', background: '#a78bfa', borderRadius: '10px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </div>
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