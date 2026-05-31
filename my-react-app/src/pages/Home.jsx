import React from 'react';

// Importando as peças do nosso quebra-cabeça
import DashboardGeral from '../jsx/DashboardGeral';
import TabelaAtividades from '../jsx/TabelaAtividades';
import Footer from '../jsx/Footer';

export default function Home() {
  return (
    // O Fragment (<></>) serve para agrupar tudo sem criar uma <div> desnecessária
    <>
      <DashboardGeral />
      <TabelaAtividades filtro="Todas" />
    </>
  );
}