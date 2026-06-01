import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './css/index.css'
import Login from './pages/LoginPage.jsx'
import Perfil from './pages/PerfilPage.jsx'
import Solicitacoes from './pages/SolicitacoesPage.jsx'
import Home from './pages/HomePage.jsx'
import Navbar from './jsx/Navbar.jsx'
import Footer from './jsx/Footer.jsx'


function AppLayout() {
  const location = useLocation()
  const hideNavOn = ['/', '/login'] 
  const hideFooterOn = ['/login', '/'] 
  return (
    <>
      {!hideNavOn.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/solicitacoes" element={<Solicitacoes />} />
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