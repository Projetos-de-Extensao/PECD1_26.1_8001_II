import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/navbar.css'

export default function Navbar({ onLogout } = {}) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [perfilOpen, setPerfilOpen] = useState(false)
  const navigate = useNavigate()

  // Recupera o usuário do localStorage para saber se é funcionário
  const usuarioSalvo = localStorage.getItem('usuario');
  const isFuncionario = usuarioSalvo ? JSON.parse(usuarioSalvo).is_funcionario : false;

  useEffect(() => {
    function handleClickFora(e) {
      if (!e.target.closest('.menu-principal') && !e.target.closest('.hamburger')) {
        setMenuAberto(false)
        setPerfilOpen(false)
      }
    }

    document.addEventListener('click', handleClickFora)
    return () => document.removeEventListener('click', handleClickFora)
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setMenuAberto(false)
        setPerfilOpen(false)
      }
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
    setPerfilOpen(false)
    navigate(path)
  }

  function togglePerfil(e) {
    e.stopPropagation()
    setPerfilOpen((v) => !v)
  }

  return (
    <>
      <div
        className={`menu-overlay ${menuAberto ? 'ativo' : ''}`}
        onClick={() => setMenuAberto(false)}
      />

      <nav className="navegacao" role="navigation" aria-label="Menu principal">
        <div className="nav-container">
          <Link to={isFuncionario ? "/admin" : "/home"} className="logo-nav" onClick={() => setMenuAberto(false)}>
            <div className="caixa-logo">I</div>
            <span>IBMEC</span>
          </Link>

          <button
            className={`hamburger ${menuAberto ? 'ativo' : ''}`}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            onClick={(e) => {
              e.stopPropagation()
              setMenuAberto((v) => !v)
            }}
          >
            <span />
            <span />
            <span />
          </button>

          <ul className={`menu-principal ${menuAberto ? 'aberto' : ''}`}>
            <button
              type="button"
              className="fechar-menu"
              onClick={() => setMenuAberto(false)}
              aria-label="Fechar"
            >
              ×
            </button>

          {/* MENU EXCLUSIVO PARA ALUNOS */}
          {!isFuncionario && (
            <>
              <li>
                <Link to="/home" className="menu-botao" onClick={() => navTo('/home')}>Home</Link>
              </li>
              <li>
                <Link to="/solicitacoes" className="menu-botao" onClick={() => navTo('/solicitacoes')}>Solicitações</Link>
              </li>
            </>
          )}

          {/* MENU EXCLUSIVO PARA FUNCIONÁRIOS */}
          {isFuncionario && (
            <li>
              <Link to="/admin" className="menu-botao" onClick={() => navTo('/admin')}>Painel Admin</Link>
            </li>
          )}
          
            <li
              className={`menu-perfil ${perfilOpen ? 'ativo' : ''}`}
              onMouseEnter={() => setPerfilOpen(true)}
              onMouseLeave={() => setPerfilOpen(false)}
            >
              <button type="button" className="menu-botao" onClick={togglePerfil}>
                Perfil <span aria-hidden="true">▾</span>
              </button>

              <button
                type="button"
                className="submenu-toggle"
                aria-label="Abrir submenu perfil"
                onClick={togglePerfil}
              />

              <ul className="submenu-perfil" role="menu">
                <li role="none">
                  <Link to="/perfil" role="menuitem" onClick={() => navTo('/perfil')}>
                    Meu perfil
                  </Link>
                </li>
                <li role="none">
                  <hr aria-hidden="true" />
                </li>
                <li role="none">
                  <a href="/logout" role="menuitem" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}