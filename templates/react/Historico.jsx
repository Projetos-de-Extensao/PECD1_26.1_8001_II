import { useState } from 'react';
import NavBar from '../../react-app/src/components/NavBar';
import '../css/historico.css';

const SOLICITACOES = [
  { id: 1, tipo: 'interna', nome: 'Workshop: Design Thinking',         data: '15/04/2026', horas: 4, status: 'aprovado'  },
  { id: 2, tipo: 'externa', nome: 'Palestra: Inovação Disruptiva',     data: '10/04/2026', horas: 2, status: 'aprovado'  },
  { id: 3, tipo: 'interna', nome: 'Curso: Python Avançado',            data: '08/04/2026', horas: 8, status: 'aprovado'  },
  { id: 4, tipo: 'externa', nome: 'Seminário: Empreendedorismo',       data: '05/04/2026', horas: 3, status: 'progresso' },
  { id: 5, tipo: 'interna', nome: 'Mentoria: Liderança',               data: '02/04/2026', horas: 2, status: 'recusado'  },
  { id: 6, tipo: 'externa', nome: 'Congresso: Tecnologia e Sociedade', data: '28/03/2026', horas: 6, status: 'progresso' },
];

const ABAS = [
  { filtro: 'todos',     label: 'Todas'          },
  { filtro: 'aprovado',  label: '✓ Aprovadas'    },
  { filtro: 'progresso', label: '⏳ Em Progresso' },
  { filtro: 'recusado',  label: '✗ Recusadas'    },
];

const STATUS_CONFIG = {
  aprovado:  { icone: '✓',  label: 'Aprovado'    },
  progresso: { icone: '⏳', label: 'Em Progresso' },
  recusado:  { icone: '✗',  label: 'Recusado'    },
};

const contadores = {
  todos:     SOLICITACOES.length,
  aprovado:  SOLICITACOES.filter(s => s.status === 'aprovado').length,
  progresso: SOLICITACOES.filter(s => s.status === 'progresso').length,
  recusado:  SOLICITACOES.filter(s => s.status === 'recusado').length,
};

function Historico() {
  const [filtro, setFiltro] = useState('todos');

  const dadosFiltrados = filtro === 'todos'
    ? SOLICITACOES
    : SOLICITACOES.filter(s => s.status === filtro);

  return (
    <>
      <NavBar />

      <main className="container-principal">
        <section className="historico-container">
          <div className="header-historico">
            <h1 className="titulo-historico">Histórico de Solicitações</h1>
            <p className="subtitulo-historico">
              Acompanhe o status de todas as suas atividades
            </p>
          </div>

          <div className="abas-filtro">
            {ABAS.map(aba => (
              <button
                key={aba.filtro}
                className={`aba-btn${filtro === aba.filtro ? ' aba-ativo' : ''}`}
                data-filtro={aba.filtro}
                onClick={() => setFiltro(aba.filtro)}
              >
                <span className="aba-label">{aba.label}</span>
                <span className="aba-count">{contadores[aba.filtro]}</span>
              </button>
            ))}
          </div>

          <div className="tabela-wrapper">
            {dadosFiltrados.length === 0 ? (
              <div className="msg-vazio">
                <p>Nenhuma solicitação encontrada com este filtro.</p>
              </div>
            ) : (
              <table className="tabela-historico" role="table">
                <thead>
                  <tr>
                    <th scope="col">Tipo</th>
                    <th scope="col">Atividade</th>
                    <th scope="col">Data</th>
                    <th scope="col">Horas</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.map(s => {
                    const st = STATUS_CONFIG[s.status];
                    return (
                      <tr key={s.id}>
                        <td>
                          <span className={`tipo-atividade tipo-${s.tipo}`}>
                            {s.tipo === 'interna' ? 'Interna' : 'Externa'}
                          </span>
                        </td>
                        <td className="nome-atividade">{s.nome}</td>
                        <td className="data-atividade">{s.data}</td>
                        <td className="horas-atividade">{s.horas}h</td>
                        <td>
                          <span className={`status-badge status-${s.status}`}>
                            <span>{st.icone}</span>
                            <span>{st.label}</span>
                          </span>
                        </td>
                        <td className="coluna-acoes">
                          <button className="btn-acao" title="Ver detalhes">
                            👁️ Ver
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <footer className="rodape">
        <p>&copy; 2026 IBMEC. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default Historico;
