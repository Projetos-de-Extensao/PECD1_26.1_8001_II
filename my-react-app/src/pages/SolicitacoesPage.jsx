import { useState } from 'react';
import TabelaAtividades from '../jsx/TabelaAtividades';
import FormInterno from '../jsx/FormInterno';
import FormExterno from '../jsx/FormExterno';
import '../css/solicitacoes.css'; 
import '../css/index.css';


export default function SolicitacoesPage() {
  const [formAtivo, setFormAtivo] = useState('interno');

  return (
    <main className="container-principal">
      <div className="layout-dual">
        
        {/* COLUNA ESQUERDA AGORA É O FORMULÁRIO */}
        <section className="coluna-formularios">
          <div className="botoes-navegacao">
            <button 
              className={`btn-nav ${formAtivo === 'interno' ? 'ativo' : ''}`}
              onClick={() => setFormAtivo('interno')}
            >
              Interna
            </button>
            <button 
              className={`btn-nav ${formAtivo === 'externo' ? 'ativo' : ''}`}
              onClick={() => setFormAtivo('externo')}
            >
              Externa
            </button>
          </div>

          <FormInterno ativo={formAtivo === 'interno'} />
          <FormExterno ativo={formAtivo === 'externo'} />
        </section>

        {/* COLUNA DIREITA AGORA É O HISTÓRICO */}
        <aside className="coluna-historico">
          <TabelaAtividades />
        </aside>

      </div>
    </main>
  );
}
