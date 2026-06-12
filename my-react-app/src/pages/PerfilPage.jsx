import React, { useEffect, useState } from "react";

// Importe os dois componentes
import Perfil from "../jsx/Perfil.jsx";
import PerfilAdm from "../jsx/PerfilAdm.jsx"; 

import '../css/perfil.css'
import '../css/index.css';

export default function PerfilPage() {
  const [isFuncionario, setIsFuncionario] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Busca os dados que você salvou no localStorage durante o login
    const usuarioSalvo = localStorage.getItem('usuario');
    
    if (usuarioSalvo) {
      const usuarioLogado = JSON.parse(usuarioSalvo);
      // Pega exatamente a flag que veio do seu backend
      setIsFuncionario(usuarioLogado.is_funcionario); 
    }
    
    setCarregando(false);
  }, []);

  // Evita que a tela pisque o layout errado antes de ler o localStorage
  if (carregando) {
    return <main className="container-principal"><p>Carregando perfil...</p></main>;
  }

  // Renderiza o painel correspondente ao tipo de usuário!
  return (
    <>
      {isFuncionario ? <PerfilAdm /> : <Perfil />}
    </>
  );
}