import { useState } from 'react';
import '../css/login.css';

function Login() {
  const [email,        setEmail]        = useState('');
  const [senha,        setSenha]        = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar,      setLembrar]      = useState(false);
  const [erroEmail,    setErroEmail]    = useState('');
  const [erroSenha,    setErroSenha]    = useState('');
  const [retorno,      setRetorno]      = useState({ texto: '', tipo: '' });
  const [entrando,     setEntrando]     = useState(false);

  function validarEmail() {
    if (!email.trim()) {
      setErroEmail('Informe seu e-mail ou RA.');
      return false;
    }
    setErroEmail('');
    return true;
  }

  function validarSenha() {
    if (!senha) {
      setErroSenha('Informe sua senha.');
      return false;
    }
    setErroSenha('');
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const emailValido = validarEmail();
    const senhaValida = validarSenha();
    if (!emailValido || !senhaValida) return;

    setEntrando(true);
    setRetorno({ texto: '', tipo: '' });

    // Simulação — substituir por fetch real quando o backend estiver pronto:
    // const resp = await fetch('/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: email.trim(), senha }),
    // });
    await new Promise(r => setTimeout(r, 1200));

    const ok = email.trim().includes('@ibmec') || /^\d{6,10}$/.test(email.trim());

    if (ok) {
      setRetorno({ texto: 'Login realizado com sucesso!', tipo: 'sucesso' });
      // Redirecionar após login bem-sucedido:
      // window.location.href = '/dashboard';
    } else {
      setRetorno({ texto: 'E-mail / RA ou senha incorretos.', tipo: 'erro' });
      setEntrando(false);
    }
  }

  return (
    <main>
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
              <label htmlFor="email">E-mail ou RA</label>
              <input
                type="text"
                id="email"
                placeholder="seu.email@ibmec.edu.br"
                value={email}
                onChange={e => { setEmail(e.target.value); setErroEmail(''); }}
                className={erroEmail ? 'com-erro' : ''}
              />
              <span className="erro">{erroEmail}</span>
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <div className="grupo-senha">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  id="senha"
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErroSenha(''); }}
                  className={erroSenha ? 'com-erro' : ''}
                />
                <button
                  type="button"
                  id="botaoSenha"
                  onClick={() => setMostrarSenha(prev => !prev)}
                >
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <span className="erro">{erroSenha}</span>
            </div>

            <div className="opcoes">
              <label className="lembrar">
                <input
                  type="checkbox"
                  id="lembrar"
                  checked={lembrar}
                  onChange={e => setLembrar(e.target.checked)}
                />
                Lembrar de mim
              </label>
              <a href="#">Esqueci minha senha</a>
            </div>

            <button type="submit" id="botaoEntrar" disabled={entrando}>
              {entrando ? 'Entrando…' : 'Entrar'}
            </button>

            {retorno.texto && (
              <p className={`retorno ${retorno.tipo}`}>
                {retorno.texto}
              </p>
            )}

          </form>

          <p className="rodape">
            Problemas? <a href="#">Fale com o suporte</a>
          </p>

        </article>
      </section>
    </main>
  );
}

export default Login;
