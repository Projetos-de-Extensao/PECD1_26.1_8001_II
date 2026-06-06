import '../css/login.css'
import '../css/index.css';


async function handleLogin(email, senha) {
  try {
    const resposta = await fetch('http://localhost:8000/api/usuarios/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      console.log('Login efetuado com sucesso!', dados.usuario);
      // Salva os dados do usuário logado no localStorage
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));
    } else {
      console.error('Erro de login:', dados.mensagem);
      // Aqui você exibe o erro na tela pro usuário
    }
  } catch (erro) {
    console.error('Falha na comunicação com a API:', erro);
  }
}


function Login() {
  return (
    <>
    <section class="pagina">
      <article class="cartao">

        <div class="logo">
          <div class="caixa-logo">I</div>
          <span>IBMEC</span>
        </div>

        <h1>Entrar</h1>
        <p class="subtitulo">Acesse o portal AAC</p>

        <form id="formularioLogin" novalidate>

          <div class="campo">
            <label for="email">E-mail ou RA</label>
            <input type="text" id="email" placeholder="seu.email@ibmec.edu.br" />
            <span class="erro" id="erroEmail"></span>
          </div>

          <div class="campo">
            <label for="senha">Senha</label>
            <div class="grupo-senha">
              <input type="password" id="senha" placeholder="••••••••" />
              <button type="button" id="botaoSenha">Mostrar</button>
            </div>
            <span class="erro" id="erroSenha"></span>
          </div>

          <div class="opcoes">
            <label class="lembrar">
              <input type="checkbox" id="lembrar" />
              Lembrar de mim
            </label>
            <a href="#">Esqueci minha senha</a>
          </div>

          <button type="submit" id="botaoEntrar">Entrar</button>

          <p id="retorno" class="retorno oculto"></p>

        </form>

        <p class="rodape">Problemas? <a href="#">Fale com o suporte</a></p>

      </article>
    </section>

    </>
  )
}

export default Login;