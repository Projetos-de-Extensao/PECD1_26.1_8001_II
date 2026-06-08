import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'
import '../css/index.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // Impede o reload da página
    setErro('');

    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setCarregando(true);

    try {
      // Descobre o IP automaticamente (seja localhost ou 192.168...)
      const urlBackend = `http://${window.location.hostname}:8000/api/usuarios/login/`;
      const resposta = await fetch(urlBackend, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        console.log('Login efetuado com sucesso!', dados.usuario);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        
        // Redireciona para o dashboard de forma fluida e sem recarregar a página
        navigate('/dashboard'); 
      } else {
        setErro(dados.mensagem || 'Credenciais inválidas.');
      }
    } catch (erro) {
      console.error('Falha na comunicação com a API:', erro);
      setErro('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
    <section className="pagina">
      <article className="cartao">

        <div className="logo">
          <div className="caixa-logo">I</div>
          <span>IBMEC</span>
        </div>

        <h1>Entrar</h1>
        <p className="subtitulo">Acesse o portal AAC</p>

        <form id="formularioLogin" noValidate onSubmit={handleSubmit}>

          <div className="campo">
            <label htmlFor="email">E-mail de Acesso</label>
            <input type="text" id="email" placeholder="aluno@ibmec.edu.br ou prof@ibmec.br" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <div className="grupo-senha">
              <input type={mostrarSenha ? "text" : "password"} id="senha" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} />
              <button type="button" id="botaoSenha" onClick={() => setMostrarSenha(!mostrarSenha)}>
                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {erro && <p className="erro" style={{color: '#b3261e', marginTop: '0.5rem', fontSize: '0.85rem'}}>{erro}</p>}

          <div className="opcoes">
            <label className="lembrar">
              <input type="checkbox" id="lembrar" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} />
              Lembrar de mim
            </label>
            <a href="#">Esqueci minha senha</a>
          </div>

          <button type="submit" id="botaoEntrar" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

        </form>

      </article>
    </section>
  )
}

export default Login