import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/login.css'
import '../css/index.css'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        navigate('/home')
      } else {
        setErro(data.detail || 'Email ou senha inválidos')
      }
    } catch {
      setErro('Erro ao conectar com a API')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section className="pagina">
      <article className="cartao">
        <div className="logo">
          <div className="caixa-logo">I</div>
          <span>IBMEC</span>
        </div>

        <h1>Entrar</h1>
        <p className="subtitulo">Acesse o portal AAC</p>

        <form id="formularioLogin" onSubmit={handleSubmit} noValidate>
          <div className="campo">
            <label htmlFor="email">E-mail ou RA</label>
            <input
              type="text"
              id="email"
              placeholder="seu.email@ibmec.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <div className="grupo-senha">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                id="senha"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                id="botaoSenha"
                onClick={() => setMostrarSenha((v) => !v)}
              >
                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <div className="opcoes">
            <label className="lembrar">
              <input type="checkbox" id="lembrar" />
              Lembrar de mim
            </label>
            <a href="#">Esqueci minha senha</a>
          </div>

          {erro && <p className="retorno">{erro}</p>}

          <button type="submit" id="botaoEntrar" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="rodape">Problemas? <a href="#">Fale com o suporte</a></p>
      </article>
    </section>
  )
}

export default Login