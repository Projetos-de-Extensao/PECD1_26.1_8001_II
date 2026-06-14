import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import '../css/cadastroInterno.css';

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ aberto }) {
  if (aberto) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function MiniLockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function CadastroInterno() {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [manterSessao, setManterSessao] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [toast, setToast] = useState({ texto: '', tipo: '' });

  function mostrarToast(texto, tipo = 'success') {
    setToast({ texto, tipo });
    window.setTimeout(() => setToast({ texto: '', tipo: '' }), 3000);
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!matricula.trim() || !email.trim() || !senha) {
      mostrarToast('Preencha matricula, e-mail e senha.', 'error');
      return;
    }

    setCarregando(true);

    try {
      const resp = await apiFetch('/api/usuarios/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data?.mensagem || 'Credenciais invalidas.');
      }

      if (!data?.usuario?.is_funcionario) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        throw new Error('Acesso permitido apenas para administradores.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      localStorage.setItem('manterSessao', manterSessao ? 'true' : 'false');

      mostrarToast('Autenticacao realizada. Redirecionando...', 'success');
      window.setTimeout(() => navigate('/admin', { replace: true }), 800);
    } catch (err) {
      mostrarToast(err.message || 'Erro ao comunicar com a API.', 'error');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="grafismo grafismo--left" />
      <div className="grafismo grafismo--right" />

      <div className="page-wrap">
        <aside className="brand-panel">
          <div className="brand-panel__inner">
            <div className="brand-logo">
              <span className="brand-logo__text">IBMEC</span>
              <span className="brand-logo__dot" />
            </div>

            <div className="brand-headline">
              <h1>
                Sistema de
                <br />
                Gestao AAC
              </h1>
              <p>Atividades de Apoio a Comunidade - painel exclusivo para administradores institucionais.</p>
            </div>

            <ul className="brand-features">
              <li><span className="icon">■</span>Controle de horas por aluno</li>
              <li><span className="icon">■</span>Aprovacao e validacao de atividades</li>
              <li><span className="icon">■</span>Relatorios e exportacoes</li>
              <li><span className="icon">■</span>Gestao de turmas e periodos</li>
            </ul>

            <p className="brand-warning">
              <span>⚠</span>
              Acesso restrito. Somente administradores autorizados pela instituicao.
            </p>
          </div>
        </aside>

        <section className="login-panel">
          <div className="login-card">
            <div className="login-card__header">
              <div className="badge-adm">ADM</div>
              <h2>Acesso Administrativo</h2>
              <p>Entre com suas credenciais institucionais para acessar o painel de gestao AAC.</p>
            </div>

            <form className="login-form" onSubmit={handleLogin} noValidate>
              <div className="form-group">
                <label htmlFor="matricula">Matricula Administrativa</label>
                <div className="input-wrap">
                  <span className="input-icon"><UserIcon /></span>
                  <input
                    type="text"
                    id="matricula"
                    name="matricula"
                    placeholder="Ex: ADM-2024-0001"
                    autoComplete="username"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    required
                  />
                </div>
                <span className="field-hint">Matricula fornecida pelo setor de TI do IBMEC</span>
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail Institucional</label>
                <div className="input-wrap">
                  <span className="input-icon"><EmailIcon /></span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="seu.nome@ibmec.br"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="senha">Senha</label>
                  <a href="mailto:ti.suporte@ibmec.edu.br" className="forgot-link">Esqueci minha senha</a>
                </div>

                <div className="input-wrap">
                  <span className="input-icon"><LockIcon /></span>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    id="senha"
                    name="senha"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setMostrarSenha((atual) => !atual)}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <EyeIcon aberto={mostrarSenha} />
                  </button>
                </div>
              </div>

              <div className="form-group form-group--row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    id="manter"
                    checked={manterSessao}
                    onChange={(e) => setManterSessao(e.target.checked)}
                  />
                  <span className="checkmark" />
                  Manter sessao ativa (8h)
                </label>
                <span className="session-info">Sessao expira automaticamente</span>
              </div>

              <button type="submit" className={`btn-login ${carregando ? 'btn-login--loading' : ''}`} id="btn-login" disabled={carregando}>
                <span className="btn-login__text">{carregando ? 'Autenticando...' : 'Entrar no Painel'}</span>
                <span className="btn-login__icon"><ArrowIcon /></span>
              </button>

              <div className="login-divider"><span>acesso seguro SSL/TLS</span></div>

              <div className="security-badges">
                <span className="sec-badge"><ShieldIcon />Autenticacao 2FA</span>
                <span className="sec-badge"><MiniLockIcon />Criptografia AES-256</span>
                <span className="sec-badge"><ClockIcon />Log de auditoria</span>
              </div>
            </form>

            <p className="support-text">
              Problemas de acesso? Contate o suporte TI:{' '}
              <a href="mailto:ti.suporte@ibmec.edu.br">ti.suporte@ibmec.edu.br</a>
            </p>
          </div>
        </section>
      </div>

      {toast.texto && (
        <div className={`toast toast--${toast.tipo} toast--show`}>
          {toast.texto}
        </div>
      )}
    </main>
  );
}
