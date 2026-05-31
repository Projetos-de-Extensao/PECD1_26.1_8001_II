import React, { useState, useEffect } from 'react';
import '../css/perfil.css';
import '../css/index.css';

// Mantemos os campos fixos, pois eles apenas mapeiam como exibir os dados na tela
const CAMPOS_PERFIL = [
  { label: 'Nome Completo',  chave: 'nomeCompleto' },
  { label: 'Matrícula',      chave: 'matricula'    },
  { label: 'Email',          chave: 'email'        },
  { label: 'Curso',          chave: 'curso'        },
  { label: 'Ano de Entrada', chave: 'anoEntrada'   },
  { label: 'Período',        chave: 'periodo'      },
];

function Perfil() {
  // ==========================================
  // ESTADOS DO USUÁRIO E API
  // ==========================================
  const [usuario, setUsuario] = useState(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [erroPerfil, setErroPerfil] = useState(false);

  // ==========================================
  // ESTADOS DA INTERFACE E MODAL
  // ==========================================
  const [menuAberto,          setMenuAberto]          = useState(false);
  const [submenuPerfilAberto, setSubmenuPerfilAberto] = useState(false);
  const [modalAberto,         setModalAberto]         = useState(false);
  
  // Estados do formulário de senha
  const [senhaAtual,   setSenhaAtual]   = useState('');
  const [senhaNova,    setSenhaNova]    = useState('');
  const [senhaConfirm, setSenhaConfirm] = useState('');
  const [msgModal,     setMsgModal]     = useState({ texto: '', tipo: '' });
  const [enviando,     setEnviando]     = useState(false);

  // ==========================================
  // BUSCA DOS DADOS DO USUÁRIO (API)
  // ==========================================
  useEffect(() => {
    async function carregarDadosUsuario() {
      try {
        // Substitua pela URL real da sua API
        const resposta = await fetch('/api/perfil/meus-dados');
        
        if (!resposta.ok) {
          throw new Error('Falha ao carregar dados do usuário');
        }

        const dados = await resposta.json();
        setUsuario(dados); // Salva os dados recebidos da API
      } catch (erro) {
        console.error("Erro na API de perfil:", erro);
        setErroPerfil(true);
      } finally {
        setCarregandoPerfil(false);
      }
    }

    carregarDadosUsuario();
  }, []);

  // ==========================================
  // EFEITOS DE INTERFACE (Menus e Scroll)
  // ==========================================
  useEffect(() => {
    function handleClickFora(e) {
      if (!e.target.closest('.menu-com-submenu')) setSubmenuPerfilAberto(false);
      if (!e.target.closest('.nav-container'))    setMenuAberto(false);
    }
    document.addEventListener('click', handleClickFora);
    return () => document.removeEventListener('click', handleClickFora);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalAberto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalAberto]);

  // ==========================================
  // LÓGICA DO MODAL E TROCA DE SENHA
  // ==========================================
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

  // ==========================================
  // RENDERIZAÇÃO CONDICIONAL (CARREGAMENTO)
  // ==========================================
  if (carregandoPerfil) {
    return (
      <main className="container-principal">
        <p style={{ textAlign: 'center', padding: '3rem' }}>Carregando dados do perfil...</p>
      </main>
    );
  }

  if (erroPerfil || !usuario) {
    return (
      <main className="container-principal">
        <p style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>
          Não foi possível carregar as informações do usuário. Tente recarregar a página.
        </p>
      </main>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO PRINCIPAL DA TELA
  // ==========================================
  return (
    <>
      <main className="container-principal">
        <section className="perfil-container">

          <div className="header-perfil">
            <div className="avatar-usuario">
              {/* Ajustado para usar a variável 'usuario' minúscula que vem do estado */}
              <span className="iniciais">{usuario.iniciais || '👤'}</span>
            </div>
            <div className="info-basica">
              <h1 className="nome-usuario">{usuario.nome}</h1>
              <p className="matricula-usuario">Matrícula: {usuario.matricula}</p>
            </div>
          </div>

          <div className="card-perfil">
            <h2 className="titulo-secao">Informações Pessoais</h2>
            <div className="grid-dados">
              {CAMPOS_PERFIL.map(({ label, chave }) => (
                <div key={chave} className="campo-info">
                  <strong>{label}</strong>
                  <div className="valor-info">{usuario[chave] || '-'}</div>
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

      {/* MODAL DE SENHA MANTIDO INTACTO */}
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