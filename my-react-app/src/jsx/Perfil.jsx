import { useState, useEffect } from 'react';
import '../css/perfil.css'
import '../css/index.css';


const USUARIO = {
  iniciais:    'GA',
  nome:        'Gabriel Aruzo',
  nomeCompleto:'Gabriel Aruzo Silva',
  matricula:   '2024001',
  email:       'gabriel.aruzo@ibmec.edu.br',
  curso:       'Administração',
  anoEntrada:  '2024',
  periodo:     '2º Semestre',
};

const CAMPOS_PERFIL = [
  { label: 'Nome Completo',  chave: 'nomeCompleto' },
  { label: 'Matrícula',      chave: 'matricula'    },
  { label: 'Email',          chave: 'email'        },
  { label: 'Curso',          chave: 'curso'        },
  { label: 'Ano de Entrada', chave: 'anoEntrada'   },
  { label: 'Período',        chave: 'periodo'      },
];

function Perfil() {
  const [menuAberto,          setMenuAberto]          = useState(false);
  const [submenuPerfilAberto, setSubmenuPerfilAberto] = useState(false);
  const [modalAberto,         setModalAberto]         = useState(false);
  const [senhaAtual,          setSenhaAtual]          = useState('');
  const [senhaNova,           setSenhaNova]           = useState('');
  const [senhaConfirm,        setSenhaConfirm]        = useState('');
  const [msgModal,            setMsgModal]            = useState({ texto: '', tipo: '' });
  const [enviando,            setEnviando]            = useState(false);

  // Fecha submenu e hamburger ao clicar fora
  useEffect(() => {
    function handleClickFora(e) {
      if (!e.target.closest('.menu-com-submenu')) setSubmenuPerfilAberto(false);
      if (!e.target.closest('.nav-container'))    setMenuAberto(false);
    }
    document.addEventListener('click', handleClickFora);
    return () => document.removeEventListener('click', handleClickFora);
  }, []);

  // Bloqueia scroll do body quando modal está aberto
  useEffect(() => {
    document.body.style.overflow = modalAberto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalAberto]);

  function abrirModal() {
    setSenhaAtual('');
    setSenhaNova('');
    setSenhaConfirm('');
    setMsgModal({ texto: '', tipo: '' });
    setModalAberto(true);
  }

  function fecharModal() {
    setSenhaAtual('');
    setSenhaNova('');
    setSenhaConfirm('');
    setMsgModal({ texto: '', tipo: '' });
    setModalAberto(false);
    setEnviando(false);
  }

  function validar() {
    if (!senhaAtual || !senhaNova || !senhaConfirm) {
      setMsgModal({ texto: 'Por favor, preencha todos os campos.', tipo: 'error' });
      return false;
    }
    if (senhaNova.length < 8) {
      setMsgModal({ texto: 'A nova senha deve ter no mínimo 8 caracteres.', tipo: 'error' });
      return false;
    }
    if (!/[A-Z]/.test(senhaNova) || !/[0-9]/.test(senhaNova)) {
      setMsgModal({ texto: 'A senha deve conter pelo menos 1 maiúscula e 1 número.', tipo: 'error' });
      return false;
    }
    if (senhaNova !== senhaConfirm) {
      setMsgModal({ texto: 'As senhas não conferem.', tipo: 'error' });
      return false;
    }
    if (senhaAtual === senhaNova) {
      setMsgModal({ texto: 'A nova senha deve ser diferente da atual.', tipo: 'error' });
      return false;
    }
    return true;
  }

  async function handleSubmitSenha(e) {
    e.preventDefault();
    setMsgModal({ texto: '', tipo: '' });
    if (!validar()) return;

    setEnviando(true);
    try {
      const resp = await fetch('/api/perfil/mudar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, senhaNova }),
      });

      if (resp.ok) {
        setMsgModal({ texto: '✓ Senha alterada com sucesso!', tipo: 'success' });
        setTimeout(fecharModal, 1500);
      } else {
        const data = await resp.json().catch(() => ({}));
        setMsgModal({ texto: data.mensagem || 'Erro ao alterar senha.', tipo: 'error' });
      }
    } catch {
      setMsgModal({ texto: 'Erro de conexão. Tente novamente.', tipo: 'error' });
    } finally {
      setEnviando(false);
    }
  }

  function handleLogout(e) {
    e.preventDefault();
    if (window.confirm('Tem certeza que deseja sair?')) {
      window.location.href = '/logout';
    }
  }

  return (
    <>
      <main className="container-principal">
        <section className="perfil-container">

          <div className="header-perfil">
            <div className="avatar-usuario">
              <span className="iniciais">{USUARIO.iniciais}</span>
            </div>
            <div className="info-basica">
              <h1 className="nome-usuario">{USUARIO.nome}</h1>
              <p className="matricula-usuario">Matrícula: {USUARIO.matricula}</p>
            </div>
          </div>

          <div className="card-perfil">
            <h2 className="titulo-secao">Informações Pessoais</h2>
            <div className="grid-dados">
              {CAMPOS_PERFIL.map(({ label, chave }) => (
                <div key={chave} className="campo-info">
                  <strong>{label}</strong>
                  <div className="valor-info">{USUARIO[chave]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-perfil">
            <h2 className="titulo-secao">Segurança</h2>
            <p className="descricao-secao">Gerencie sua senha e segurança da conta</p>
            <button className="btn btn-principal btn-grande" onClick={abrirModal}>
              🔐 Mudar Senha
            </button>
          </div>

        </section>
      </main>

      {/* Modal — renderização condicional preserva a animação slideUp a cada abertura */}
      {modalAberto && (
        <div className="modal ativo" onClick={fecharModal}>
          <div className="modal-conteudo" onClick={e => e.stopPropagation()}>

            <div className="modal-header">
              <h2>Mudar Senha</h2>
              <button className="btn-fechar" aria-label="Fechar" onClick={fecharModal}>
                ✕
              </button>
            </div>

            <form className="form-senha" noValidate onSubmit={handleSubmitSenha}>
              <div className="campo-form">
                <label htmlFor="senhaAtual">Senha Atual</label>
                <input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={senhaAtual}
                  onChange={e => setSenhaAtual(e.target.value)}
                  required
                />
              </div>

              <div className="campo-form">
                <label htmlFor="senhaNova">Nova Senha</label>
                <input
                  id="senhaNova"
                  name="senhaNova"
                  type="password"
                  placeholder="Digite uma nova senha"
                  value={senhaNova}
                  onChange={e => setSenhaNova(e.target.value)}
                  required
                />
                <p className="requisitos">Mínimo 8 caracteres, 1 maiúscula, 1 número</p>
              </div>

              <div className="campo-form">
                <label htmlFor="senhaConfirm">Confirmar Senha</label>
                <input
                  id="senhaConfirm"
                  name="senhaConfirm"
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={senhaConfirm}
                  onChange={e => setSenhaConfirm(e.target.value)}
                  required
                />
              </div>

              {msgModal.texto && (
                <div className={`msg-modal ${msgModal.tipo}`} role="status" aria-live="polite">
                  {msgModal.texto}
                </div>
              )}

              <div className="modal-acoes">
                <button type="button" className="btn btn-secundario" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-principal" disabled={enviando}>
                  {enviando ? 'Atualizando...' : 'Atualizar Senha'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}

export default Perfil;