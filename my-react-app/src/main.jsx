import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import './css/index.css'
import LoginPage from './pages/LoginPage.jsx'
import PerfilPage from './pages/PerfilPage.jsx'
import SolicitacoesPage from './pages/SolicitacoesPage.jsx'
import HomePage from './pages/HomePage.jsx'
import Navbar from './jsx/Navbar.jsx'
import Footer from './jsx/Footer.jsx'

function AppLayout() {
  const location = useLocation()

  const hideNavOn = ['/', '/login']
  const hideFooterOn = ['/', '/login']

  return (
    <>
      {!hideNavOn.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/solicitacoes" element={<SolicitacoesPage />} />
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