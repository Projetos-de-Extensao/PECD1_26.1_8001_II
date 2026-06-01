import { useState, useEffect } from 'react';
import '../css/base.css';

function NavBar() {
  const [solicitacoesOpen, setSolicitacoesOpen] = useState(false);
  const [perfilOpen, setPerfilOpen] = useState(false);

  // Fecha os dois dropdowns ao clicar fora da nav
  useEffect(() => {
    function handleClickFora(e) {
      if (!e.target.closest('.navegacao')) {
        setSolicitacoesOpen(false);
        setPerfilOpen(false);
      }
    }
    document.addEventListener('click', handleClickFora);
    return () => document.removeEventListener('click', handleClickFora);
  }, []);

  return (
    <nav className="navegacao" role="navigation" aria-label="Menu principal">
        <div className="nav-container">
          <a href="/" className="logo-nav" aria-label="IBMEC - Início">
            <div className="caixa-logo">I</div>
            <span>IBMEC</span>
          </a>

          <ul className="menu-principal">
            <li>
              <a href="/dashboard" className="menu-link">Home</a>
            </li>

            <li className="menu-com-submenu">
              <button
                className="menu-botao"
                aria-expanded={solicitacoesOpen}
                aria-haspopup="true"
                onClick={() => setSolicitacoesOpen(prev => !prev)}
              >
                Solicitações <span aria-hidden="true">▼</span>
              </button>
              <ul className={`submenu${solicitacoesOpen ? ' aberto' : ''}`} role="menu">
                <li role="none"><a href="/historico" role="menuitem">Histórico</a></li>
                <li role="none"><a href="/interno" role="menuitem">Interna</a></li>
                <li role="none"><a href="/externo" role="menuitem" target="_blank" rel="noreferrer">Externa</a></li>
              </ul>
            </li>

            <li className="menu-perfil">
              <button
                className="menu-botao menu-perfil-botao"
                aria-expanded={perfilOpen}
                aria-haspopup="true"
                onClick={() => setPerfilOpen(prev => !prev)}
              >
                Perfil <span aria-hidden="true">▼</span>
              </button>
              <ul className={`submenu-perfil${perfilOpen ? ' aberto' : ''}`} role="menu">
                <li role="none"><a href="/editar-perfil" role="menuitem">Editar Perfil</a></li>
                <li role="none"><a href="/configuracoes" role="menuitem">Configurações</a></li>
                <li role="none"><hr aria-hidden="true" /></li>
                <li role="none"><a href="/logout" role="menuitem">Sair</a></li>
              </ul>
            </li>
          </ul>
        </div>
    </nav>
  );
}

export default NavBar;
