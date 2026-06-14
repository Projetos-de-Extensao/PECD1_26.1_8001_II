import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css'
import '../css/index.css';
import { API_BASE } from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [recuperacao, setRecuperacao] = useState({
    email: '',
    matricula: '',
    senhaNova: '',
    senhaConfirm: '',
  });
  const [msgRecuperacao, setMsgRecuperacao] = useState({ tipo: '', texto: '' });
  const [enviandoRecuperacao, setEnviandoRecuperacao] = useState(false);
  const navigate = useNavigate();

  function atualizarRecuperacao(campo, valor) {
    setRecuperacao((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function abrirModalSenha(e) {
    e.preventDefault();
    setRecuperacao({
      email,
      matricula: '',
      senhaNova: '',
      senhaConfirm: '',
    });
    setMsgRecuperacao({ tipo: '', texto: '' });
    setModalSenhaAberto(true);
  }

  function fecharModalSenha() {
    setModalSenhaAberto(false);
    setMsgRecuperacao({ tipo: '', texto: '' });
    setEnviandoRecuperacao(false);
  }

  async function handleRecuperarSenha(e) {
    e.preventDefault();
    setMsgRecuperacao({ tipo: '', texto: '' });

    if (!recuperacao.email || !recuperacao.matricula || !recuperacao.senhaNova || !recuperacao.senhaConfirm) {
      setMsgRecuperacao({ tipo: 'erro', texto: 'Preencha todos os campos.' });
      return;
    }

    if (recuperacao.senhaNova.length < 8) {
      setMsgRecuperacao({ tipo: 'erro', texto: 'A nova senha deve ter pelo menos 8 caracteres.' });
      return;
    }

    if (recuperacao.senhaNova !== recuperacao.senhaConfirm) {
      setMsgRecuperacao({ tipo: 'erro', texto: 'As senhas não conferem.' });
      return;
    }

    setEnviandoRecuperacao(true);

    try {
      const resposta = await fetch(`${API_BASE}/api/usuarios/recuperar-senha/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recuperacao.email,
          matricula: recuperacao.matricula,
          senhaNova: recuperacao.senhaNova,
        }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        setMsgRecuperacao({ tipo: 'erro', texto: dados.mensagem || 'Não foi possível redefinir a senha.' });
        return;
      }

      setSenha('');
      setMsgRecuperacao({ tipo: 'sucesso', texto: dados.mensagem || 'Senha redefinida com sucesso.' });
      setTimeout(fecharModalSenha, 1400);
    } catch {
      setMsgRecuperacao({ tipo: 'erro', texto: 'Erro de conexão com o servidor.' });
    } finally {
      setEnviandoRecuperacao(false);
    }
  }

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
      const urlBackend = `${API_BASE}/api/usuarios/login/`;
      const resposta = await fetch(urlBackend, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        console.log('Login efetuado com sucesso!', dados.usuario);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        localStorage.setItem('token', dados.token);
        
        // Redireciona para o dashboard de forma fluida e sem recarregar a página
        navigate('/home'); 
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
    <section className="pagina login-page">
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
            <a href="/recuperar-senha" onClick={abrirModalSenha}>Esqueci minha senha</a>
          </div>



          <button type="submit" id="botaoEntrar" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="cadastro">
            <p>Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
          </div>

        </form>

      </article>
    </section>

    {modalSenhaAberto && (
      <div className="modal-recuperacao" onClick={fecharModalSenha}>
        <div className="modal-recuperacao__card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-recuperacao__header">
            <h2>Redefinir senha</h2>
            <button type="button" onClick={fecharModalSenha} aria-label="Fechar">×</button>
          </div>

          <form className="modal-recuperacao__form" onSubmit={handleRecuperarSenha} noValidate>
            <label>
              <span>E-mail de acesso</span>
              <input
                type="email"
                value={recuperacao.email}
                onChange={(e) => atualizarRecuperacao('email', e.target.value)}
                placeholder="seu.email@ibmec.edu.br"
              />
            </label>

            <label>
              <span>Matrícula</span>
              <input
                type="text"
                value={recuperacao.matricula}
                onChange={(e) => atualizarRecuperacao('matricula', e.target.value)}
                placeholder="Sua matrícula"
              />
            </label>

            <label>
              <span>Nova senha</span>
              <input
                type="password"
                value={recuperacao.senhaNova}
                onChange={(e) => atualizarRecuperacao('senhaNova', e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
            </label>

            <label>
              <span>Confirmar nova senha</span>
              <input
                type="password"
                value={recuperacao.senhaConfirm}
                onChange={(e) => atualizarRecuperacao('senhaConfirm', e.target.value)}
                placeholder="Repita a nova senha"
              />
            </label>

            {msgRecuperacao.texto && (
              <div className={`modal-recuperacao__mensagem modal-recuperacao__mensagem--${msgRecuperacao.tipo}`}>
                {msgRecuperacao.texto}
              </div>
            )}

            <div className="modal-recuperacao__acoes">
              <button type="button" className="btn-modal-secundario" onClick={fecharModalSenha} disabled={enviandoRecuperacao}>
                Cancelar
              </button>
              <button type="submit" className="btn-modal-principal" disabled={enviandoRecuperacao}>
                {enviandoRecuperacao ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}
export default Login;
