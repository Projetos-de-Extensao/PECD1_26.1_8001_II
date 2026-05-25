import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './css/index.css'
import Login from './jsx/Login.jsx'
import Perfil from './jsx/Perfil.jsx'
import Solicitacoes from './jsx/Solicitacoes.jsx'
import Dashboard from './jsx/Dashboard.jsx'
import Navbar from './jsx/Navbar.jsx'
import Footer from './jsx/Footer.js'

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
        <Route path="/home" element={<Dashboard />} />
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