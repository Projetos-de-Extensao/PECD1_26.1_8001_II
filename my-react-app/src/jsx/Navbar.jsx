import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/navbar.css'

export default function Navbar({ onLogout } = {}) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [solicitacoesOpen, setSolicitacoesOpen] = useState(false)
  const [perfilOpen, setPerfilOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickFora(e) {
      if (!e.target.closest('.navegacao')) {
        setMenuAberto(false)
        setSolicitacoesOpen(false)
        setPerfilOpen(false)
      }
    }
    document.addEventListener('click', handleClickFora)
    return () => document.removeEventListener('click', handleClickFora)
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setMenuAberto(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleLogout(e) {
    e.preventDefault()
    if (typeof onLogout === 'function') onLogout()
    navigate('/login', { replace: true })
  }

  function navTo(path) {
    setMenuAberto(false)
    setSolicitacoesOpen(false)
    setPerfilOpen(false)
    navigate(path)
  }

  return (
    <nav className="navegacao" role="navigation" aria-label="Menu principal">
      <div className="nav-container">
        <Link to="/dashboard" className="logo-nav" onClick={() => setMenuAberto(false)}>
          <div className="caixa-logo">I</div>
          <span>IBMEC</span>
        </Link>

        <button
          className={`hamburger ${menuAberto ? 'ativo' : ''}`}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          onClick={(e) => { e.stopPropagation(); setMenuAberto(v => !v) }}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`menu-principal ${menuAberto ? 'aberto' : ''}`}>
          <li>
            <Link to="/home" onClick={() => navTo('/home')}>Home</Link>
          </li>

          {/* Solicitações: rótulo também é Link + submenu */}
          <li
            className={`menu-com-submenu ${solicitacoesOpen ? 'ativo' : ''}`}
            onMouseEnter={() => setSolicitacoesOpen(true)}
            onMouseLeave={() => setSolicitacoesOpen(false)}
          >
            <Link
              to="/solicitacoes"
              className="menu-botao"
              onClick={(e) => { e.preventDefault(); navTo('/solicitacoes') }}
            >
              Solicitações <span aria-hidden="true">▾</span>
            </Link>

            <button
              className="submenu-toggle"
              aria-label="Abrir submenu solicitações"
              onClick={(e) => { e.stopPropagation(); setSolicitacoesOpen(v => !v) }}
            />
            <ul className="submenu" role="menu">
              <li role="none">
                <Link to="/solicitacoes" role="menuitem" onClick={() => navTo('/solicitacoes')}>Solicitações</Link>
              </li>
            </ul>
          </li>

          {/* Perfil: rótulo também é Link + submenu */}
          <li
            className={`menu-perfil ${perfilOpen ? 'ativo' : ''}`}
            onMouseEnter={() => setPerfilOpen(true)}
            onMouseLeave={() => setPerfilOpen(false)}
          >
            <Link
              to="/perfil"
              className="menu-botao"
              onClick={(e) => { e.preventDefault(); navTo('/perfil') }}
            >
              Perfil <span aria-hidden="true">▾</span>
            </Link>

            <button
              className="submenu-toggle"
              aria-label="Abrir submenu perfil"
              onClick={(e) => { e.stopPropagation(); setPerfilOpen(v => !v) }}
            />
            <ul className="submenu-perfil" role="menu">
              <li role="none"><Link to="/perfil" role="menuitem" onClick={() => navTo('/perfil')}>Meu Perfil</Link></li>
              <li role="none"><Link to="/config" role="menuitem" onClick={() => navTo('/config')}>Configurações</Link></li>
              <li role="none"><hr aria-hidden="true" /></li>
              <li role="none"><a href="/logout" role="menuitem" onClick={handleLogout}>Sair</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
}

