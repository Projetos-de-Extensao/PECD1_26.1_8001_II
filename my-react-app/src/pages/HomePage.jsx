import React from 'react';

// Importando as peças do nosso quebra-cabeça
import DashboardGeral from '../jsx/DashboardGeral';
import TabelaAtividades from '../jsx/TabelaAtividades';
import Footer from '../jsx/Footer';
import '../css/index.css';


export default function HomePage() {
  return (
    <>
      <DashboardGeral />
      <TabelaAtividades filtro="Todas" />
    </>
  );
}