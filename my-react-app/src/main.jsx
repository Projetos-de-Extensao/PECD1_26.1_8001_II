import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import './css/index.css'
import './api'
import LoginPage from './pages/LoginPage.jsx'
import PerfilPage from './pages/PerfilPage.jsx'
import SolicitacoesPage from './pages/SolicitacoesPage.jsx'
import HomePage from './pages/HomePage.jsx'
import Navbar from './jsx/Navbar.jsx'
import Footer from './jsx/Footer.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CadastroAlunosPage from './pages/CadastroPage.jsx'

// ==========================================
// 1. CRIANDO OS GUARDIÕES DE ROTA
// ==========================================

// Guardião Padrão: Só deixa passar se estiver logado (Aluno ou Admin)
function RotaPrivada({ children }) {
  const usuarioLogado = localStorage.getItem('usuario');
  const token = localStorage.getItem('token');
  
  // Se não tem nada no localStorage, chuta de volta pra tela de login
  if (!usuarioLogado || !token) {
    return <Navigate to="/login" replace />; 
  }
  
  // Se estiver logado, renderiza o componente que ele pediu
  return children; 
}

// Guardião Master: Só deixa passar se estiver logado E for funcionário
function RotaAdmin({ children }) {
  const usuarioSalvo = localStorage.getItem('usuario');
  const token = localStorage.getItem('token');
  
  if (!usuarioSalvo || !token) {
    return <Navigate to="/login" replace />;
  }

  const usuarioLogado = JSON.parse(usuarioSalvo);
  
  // Se um aluno comum tentar acessar a URL /admin, joga ele pra home
  if (!usuarioLogado.is_funcionario) {
    return <Navigate to="/home" replace />; 
  }

  // Se for funcionário mesmo, libera o acesso
  return children; 
}


// ==========================================
// 2. APLICANDO OS GUARDIÕES NO LAYOUT
// ==========================================

function AppLayout() {
  const location = useLocation()

  const hideNavOn = ['/', '/login', '/cadastro']
  const hideFooterOn = ['/', '/login', '/cadastro']

  return (
    <>
      {!hideNavOn.includes(location.pathname) && <Navbar />}

      <Routes>
        {/* Rotas Públicas (Qualquer um acessa) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroAlunosPage />} />

        {/* Rotas Privadas Padrão (Exigem Login) */}
        <Route 
          path="/home" 
          element={ <RotaPrivada><HomePage /></RotaPrivada> } 
        />
        <Route 
          path="/perfil" 
          element={ <RotaPrivada><PerfilPage /></RotaPrivada> } 
        />
        <Route 
          path="/solicitacoes" 
          element={ <RotaPrivada><SolicitacoesPage /></RotaPrivada> } 
        />

        {/* Rota Privada Admin (Exige Login + is_funcionario = true) */}
        <Route 
          path="/admin" 
          element={ <RotaAdmin><AdminPage /></RotaAdmin> } 
        />

      </Routes>

      {!hideFooterOn.includes(location.pathname) && <Footer />}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </StrictMode>
)
