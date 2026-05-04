const formularioValidacao = document.getElementById('formularioValidacao');
const codigoComprovante = document.getElementById('codigoComprovante');
const erroCodigo = document.getElementById('erroCodigo');
const botaoValidar = document.getElementById('botaoValidar');
const retornoValidacao = document.getElementById('retornoValidacao');
const statusAtual = document.getElementById('statusAtual');
const textoStatus = document.querySelector('.texto-status');

const codigosValidos = ['AAC-2026-0558', 'CERT-IB-12345', 'AAC-VAL-001'];

function exibirErro(mensagem) {
  erroCodigo.textContent = mensagem;
  retornoValidacao.className = 'retorno erro';
  retornoValidacao.textContent = mensagem;
  retornoValidacao.classList.remove('oculto');
}

function exibirSucesso(mensagem) {
  erroCodigo.textContent = '';
  retornoValidacao.className = 'retorno sucesso';
  retornoValidacao.textContent = mensagem;
  retornoValidacao.classList.remove('oculto');
}

function validarCodigo() {
  const codigo = codigoComprovante.value.trim();

  if (!codigo) {
    erroCodigo.textContent = 'Informe o código do comprovante.';
    return false;
  }

  erroCodigo.textContent = '';
  return true;
}

formularioValidacao.addEventListener('submit', (evento) => {
  evento.preventDefault();

  if (!validarCodigo()) {
    retornoValidacao.className = 'retorno erro';
    retornoValidacao.textContent = 'Preencha o código para verificar o comprovante.';
    retornoValidacao.classList.remove('oculto');
    return;
  }

  botaoValidar.disabled = true;
  botaoValidar.textContent = 'Validando...';
  retornoValidacao.className = 'retorno oculto';

  setTimeout(() => {
    const codigo = codigoComprovante.value.trim();
    const valido = codigosValidos.includes(codigo);

    if (valido) {
      statusAtual.textContent = 'Validado';
      textoStatus.textContent = 'O comprovante é válido e o envio dos certificados foi confirmado.';
      exibirSucesso('Comprovante validado com sucesso.');
    } else {
      statusAtual.textContent = 'Inválido';
      textoStatus.textContent = 'O código não foi reconhecido. Verifique e tente novamente.';
      exibirErro('Código de comprovante inválido.');
    }

    botaoValidar.disabled = false;
    botaoValidar.textContent = 'Validar comprovante';
  }, 900);
});
