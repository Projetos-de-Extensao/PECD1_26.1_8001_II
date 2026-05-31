import React, { useState } from 'react';
import TabelaAtividades from '../jsx/TabelaAtividades';
import FormInterno from '../jsx/FormInterno';
import FormExterno from '../jsx/FormExterno';

export default function Solicitacoes() {
  const [formAtivo, setFormAtivo] = useState('interno');

  return (
    <main className="container-principal">
      <div className="layout-dual">
        
        {/* COLUNA ESQUERDA */}
        <aside className="coluna-historico">
          <TabelaAtividades />
        </aside>

        {/* COLUNA DIREITA */}
        <section className="coluna-formularios">
          <div className="botoes-navegacao">
            <button onClick={() => setFormAtivo('interno')}>Interna</button>
            <button onClick={() => setFormAtivo('externo')}>Externa</button>
          </div>

          {/* O pai decide quem ganha a prop ativo */}
          <FormInterno ativo={formAtivo === 'interno'} />
          <FormExterno ativo={formAtivo === 'externo'} />
        </section>

      </div>
    </main>
  );
}