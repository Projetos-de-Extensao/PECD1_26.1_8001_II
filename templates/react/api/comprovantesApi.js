/**
 * ============================================================
 *  CAMADA DE API — COMPROVANTES AAC
 * ============================================================
 *
 *  Este módulo concentra TODAS as operações de comprovantes
 *  (listar, enviar, aprovar, recusar). Hoje ele persiste no
 *  localStorage do navegador para que o protótipo funcione de
 *  ponta a ponta sem backend.
 *
 *  >>> PARA A EQUIPE DE BACKEND <<<
 *  Cada função tem um bloco "TODO: substituir por fetch real"
 *  marcando exatamente onde a chamada HTTP deve entrar.
 *  A assinatura das funções (parâmetros e retornos) deve ser
 *  mantida — assim os componentes React continuam funcionando
 *  sem nenhuma alteração quando a API real for plugada.
 *
 *  Endpoints sugeridos (ajuste conforme contrato real):
 *    GET    /api/comprovantes
 *    POST   /api/comprovantes
 *    PATCH  /api/comprovantes/:id/aprovar
 *    PATCH  /api/comprovantes/:id/recusar  body: { motivo }
 * ============================================================
 */

const CHAVE_STORAGE = 'aac:comprovantes';
const EVENTO_MUDANCA = 'aac:comprovantes:atualizado';
const TAMANHO_MAX_ARQUIVO = 4 * 1024 * 1024; // 4MB no protótipo

// const API_BASE = import.meta.env?.VITE_API_URL || '/api';

// ────────────────────────────────────────────────────────────
// Helpers internos (somente do fallback localStorage)
// ────────────────────────────────────────────────────────────

function lerLista() {
  try {
    const raw = localStorage.getItem(CHAVE_STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function salvarLista(lista) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
  window.dispatchEvent(new CustomEvent(EVENTO_MUDANCA));
}

function gerarId() {
  const ano = new Date().getFullYear();
  const aleatorio = Math.floor(1000 + Math.random() * 9000);
  return `AAC-${ano}-${aleatorio}`;
}

function dataHojeBR() {
  return new Date().toLocaleDateString('pt-BR');
}

function arquivoParaDataURL(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
    reader.readAsDataURL(arquivo);
  });
}

// ────────────────────────────────────────────────────────────
//  API pública
// ────────────────────────────────────────────────────────────

/**
 * Lista todos os comprovantes do sistema.
 * @returns {Promise<Array>}
 */
export async function listarComprovantes() {
  // TODO (backend): substituir pelo fetch real.
  // Exemplo:
  // const resp = await fetch(`${API_BASE}/comprovantes`);
  // if (!resp.ok) throw new Error('Falha ao carregar comprovantes.');
  // return await resp.json();

  return lerLista();
}

/**
 * Envia um novo comprovante (chamado pelo aluno em Externo/Interno).
 * @param {object} dados
 * @param {string} dados.aluno
 * @param {string} dados.matricula
 * @param {string} dados.curso
 * @param {string} dados.atividade
 * @param {'interna'|'externa'} dados.tipo
 * @param {number} dados.horas
 * @param {string} [dados.dataAtividade]
 * @param {string} [dados.observacao]
 * @param {File}   [dados.arquivo]  Opcional (apenas Externo)
 * @returns {Promise<object>} comprovante criado
 */
export async function enviarComprovante(dados) {
  if (dados.arquivo && dados.arquivo.size > TAMANHO_MAX_ARQUIVO) {
    throw new Error('Arquivo maior que 4MB. Reduza o tamanho e tente novamente.');
  }

  // TODO (backend): substituir pelo fetch real.
  // Use FormData para enviar o arquivo:
  //
  // const fd = new FormData();
  // fd.append('aluno',         dados.aluno);
  // fd.append('matricula',     dados.matricula);
  // fd.append('curso',         dados.curso);
  // fd.append('atividade',     dados.atividade);
  // fd.append('tipo',          dados.tipo);
  // fd.append('horas',         dados.horas);
  // fd.append('dataAtividade', dados.dataAtividade || '');
  // fd.append('observacao',    dados.observacao || '');
  // if (dados.arquivo) fd.append('arquivo', dados.arquivo);
  //
  // const resp = await fetch(`${API_BASE}/comprovantes`, { method: 'POST', body: fd });
  // if (!resp.ok) throw new Error(await resp.text());
  // return await resp.json();

  let arquivoInfo = null;
  if (dados.arquivo) {
    const dataUrl = await arquivoParaDataURL(dados.arquivo);
    arquivoInfo = {
      nome: dados.arquivo.name,
      tipo: dados.arquivo.type || 'application/octet-stream',
      tamanho: dados.arquivo.size,
      dataUrl,
    };
  }

  const novo = {
    id: gerarId(),
    aluno: dados.aluno || 'Aluno não identificado',
    matricula: dados.matricula || '—',
    curso: dados.curso || '—',
    atividade: dados.atividade,
    tipo: dados.tipo,
    horas: Number(dados.horas) || 0,
    dataAtividade: dados.dataAtividade || '',
    dataEnvio: dataHojeBR(),
    observacao: dados.observacao || '',
    arquivo: arquivoInfo,
    status: 'pendente',
    motivoRecusa: '',
    avaliadoPor: '',
    dataAvaliacao: '',
  };

  const lista = lerLista();
  lista.unshift(novo);
  salvarLista(lista);
  return novo;
}

/**
 * Aprova um comprovante (chamado pela Coordenação).
 * @param {string} id
 * @param {string} [avaliador]
 * @returns {Promise<object>} comprovante atualizado
 */
export async function aprovarComprovante(id, avaliador = 'Coordenação') {
  // TODO (backend): substituir pelo fetch real.
  // const resp = await fetch(`${API_BASE}/comprovantes/${id}/aprovar`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ avaliador }),
  // });
  // if (!resp.ok) throw new Error('Falha ao aprovar comprovante.');
  // return await resp.json();

  let atualizado = null;
  const lista = lerLista().map(c => {
    if (c.id !== id) return c;
    atualizado = {
      ...c,
      status: 'aprovado',
      motivoRecusa: '',
      avaliadoPor: avaliador,
      dataAvaliacao: dataHojeBR(),
    };
    return atualizado;
  });
  salvarLista(lista);
  return atualizado;
}

/**
 * Recusa um comprovante com um motivo (chamado pela Coordenação).
 * @param {string} id
 * @param {string} motivo
 * @param {string} [avaliador]
 * @returns {Promise<object>} comprovante atualizado
 */
export async function recusarComprovante(id, motivo, avaliador = 'Coordenação') {
  if (!motivo || !motivo.trim()) {
    throw new Error('Motivo da recusa é obrigatório.');
  }

  // TODO (backend): substituir pelo fetch real.
  // const resp = await fetch(`${API_BASE}/comprovantes/${id}/recusar`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ motivo, avaliador }),
  // });
  // if (!resp.ok) throw new Error('Falha ao recusar comprovante.');
  // return await resp.json();

  let atualizado = null;
  const lista = lerLista().map(c => {
    if (c.id !== id) return c;
    atualizado = {
      ...c,
      status: 'recusado',
      motivoRecusa: motivo.trim(),
      avaliadoPor: avaliador,
      dataAvaliacao: dataHojeBR(),
    };
    return atualizado;
  });
  salvarLista(lista);
  return atualizado;
}

/**
 * Inscreve um callback para mudanças na lista de comprovantes.
 *
 * Usado pela tela da Coordenação para atualizar em tempo real
 * quando um aluno envia um comprovante novo (mesma aba ou outras).
 *
 * >>> PARA A EQUIPE DE BACKEND <<<
 * Quando houver API real, esta função pode ser implementada com:
 *   - polling (setInterval chamando listarComprovantes),
 *   - WebSocket (recomendado),
 *   - Server-Sent Events.
 *
 * @param {Function} callback chamado sem argumentos quando algo muda
 * @returns {Function} cleanup para desinscrever
 */
export function inscreverMudancas(callback) {
  const handlerLocal    = () => callback();
  const handlerCrossTab = (e) => { if (e.key === CHAVE_STORAGE) callback(); };

  window.addEventListener(EVENTO_MUDANCA, handlerLocal);
  window.addEventListener('storage',      handlerCrossTab);

  return () => {
    window.removeEventListener(EVENTO_MUDANCA, handlerLocal);
    window.removeEventListener('storage',      handlerCrossTab);
  };
}
