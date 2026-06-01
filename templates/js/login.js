const formulario  = document.getElementById('formularioLogin');
const emailEl     = document.getElementById('email');
const senhaEl     = document.getElementById('senha');
const erroEmail   = document.getElementById('erroEmail');
const erroSenha   = document.getElementById('erroSenha');
const botaoSenha  = document.getElementById('botaoSenha');
const botaoEntrar = document.getElementById('botaoEntrar');
const retorno     = document.getElementById('retorno');

// Mostrar / ocultar senha
botaoSenha.addEventListener('click', () => {
  const oculta = senhaEl.type === 'password';
  senhaEl.type          = oculta ? 'text' : 'password';
  botaoSenha.textContent = oculta ? 'Ocultar' : 'Mostrar';
});

// Submissão
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailValido = validarEmail();
  const senhaValida = validarSenha();
  if (!emailValido || !senhaValida) return;

  botaoEntrar.disabled    = true;
  botaoEntrar.textContent = 'Entrando…';
  retorno.className       = 'retorno oculto';

  // Simulação — substituir por fetch real
  await new Promise(r => setTimeout(r, 1200));

  const email = emailEl.value.trim();
  const ok    = email.includes('@ibmec') || /^\d{6,10}$/.test(email);

  if (ok) {
    retorno.textContent = 'Login realizado com sucesso!';
    retorno.className   = 'retorno sucesso';
  } else {
    retorno.textContent = 'E-mail / RA ou senha incorretos.';
    retorno.className   = 'retorno erro';
    botaoEntrar.disabled    = false;
    botaoEntrar.textContent = 'Entrar';
  }
});

function validarEmail() {
  const valor = emailEl.value.trim();
  if (!valor) {
    erroEmail.textContent = 'Informe seu e-mail ou RA.';
    emailEl.classList.add('com-erro');
    return false;
  }
  erroEmail.textContent = '';
  emailEl.classList.remove('com-erro');
  return true;
}

function validarSenha() {
  const valor = senhaEl.value;
  if (!valor) {
    erroSenha.textContent = 'Informe sua senha.';
    senhaEl.classList.add('com-erro');
    return false;
  }
  erroSenha.textContent = '';
  senhaEl.classList.remove('com-erro');
  return true;
}
