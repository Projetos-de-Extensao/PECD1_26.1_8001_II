export const API_BASE = `http://${window.location.hostname}:8000`;

export function getAuthToken() {
  return localStorage.getItem('token');
}

export function getUsuarioLogado() {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
}

function isPublicApiPath(url) {
  return [
    '/api/usuarios/login/',
    '/api/usuarios/criar/',
    '/api/usuarios/recuperar-senha/',
  ].some((path) => url.includes(path));
}

export async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const headers = new Headers(options.headers || {});

  if (token && !isPublicApiPath(url) && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export async function apiJson(path, options = {}) {
  const resp = await apiFetch(path, options);
  const data = await resp.json().catch(() => null);

  if (!resp.ok) {
    const mensagem = data?.mensagem || data?.detail || 'Erro ao comunicar com a API.';
    throw new Error(mensagem);
  }

  return data?.results || data || [];
}

const originalFetch = window.fetch.bind(window);

window.fetch = (input, options = {}) => {
  const url = typeof input === 'string' ? input : input?.url || '';
  const isApiCall = url.includes('/api/') || url.startsWith(`${API_BASE}/api/`);
  const token = getAuthToken();

  if (!isApiCall || !token || isPublicApiPath(url)) {
    return originalFetch(input, options);
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return originalFetch(input, {
    ...options,
    headers,
  });
};
