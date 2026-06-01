import NavBar from '../../react-app/src/components/NavBar';
import { TabelaHistorico } from '../../react-app/src/components/TabelaHistorico';
import { GraficoHoras } from '../../react-app/src/components/GraficoHoras';
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
        <GraficoHoras HORAS={HORAS} totalPct={totalPct} internasPct={internasPct} externasPct={externasPct} internasDash={internasDash} externasDash={externasDash} />

        <TabelaHistorico atividades={ATIVIDADES} />
      </main>

      <footer className="rodape">
        <p>&copy; 2026 IBMEC. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default Dashboard;
