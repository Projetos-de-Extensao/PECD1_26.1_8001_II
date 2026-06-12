import React, { useState, useEffect } from 'react';
import '../css/perfil.css';
import '../css/index.css';

const CAMPOS_PERFIL = [
  { label: 'Nome Completo', chave: 'nomeCompleto' },
  { label: 'Email', chave: 'email' },
];

const ADMIN_ZERADO = {
  iniciais: '',
  nome: '',
  nomeCompleto: '',
  email: '',
  matricula: '', // Mantido apenas para a lógica de requisição ao backend
};

function PerfilAdm() {
  const [admin, setAdmin] = useState(ADMIN_ZERADO);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaConfirm, setSenhaConfirm] = useState('');
  const [msgModal, setMsgModal] = useState({ texto: '', tipo: '' });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function carregarDadosAdmin() {
      try {
        const usuarioSalvo = localStorage.getItem('usuario');
        if (!usuarioSalvo) {
          setAdmin(ADMIN_ZERADO);
          setCarregandoPerfil(false);
          return;
        }

        const adminLogado = JSON.parse(usuarioSalvo);

        const resposta = await fetch('http://localhost:8000/api/usuarios/meus-dados/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Usuario-Matricula': adminLogado.matricula
          }
        });

        if (!resposta.ok) {
          setAdmin(ADMIN_ZERADO);
          return;
        }

        const dados = await resposta.json().catch(() => null);

        if (!dados || typeof dados !== 'object' || Object.keys(dados).length === 0) {
          setAdmin(ADMIN_ZERADO);
          return;
        }

        setAdmin({ ...ADMIN_ZERADO, ...dados });
      } catch {
        setAdmin(ADMIN_ZERADO);
      } finally {
        setCarregandoPerfil(false);
      }
    }

    carregarDadosAdmin();
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalAberto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
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
      const usuarioSalvo = localStorage.getItem('usuario');
      const matricula = usuarioSalvo ? JSON.parse(usuarioSalvo).matricula : '';

      const resp = await fetch('http://localhost:8000/api/usuarios/mudar-senha/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Usuario-Matricula': matricula
        },
        body: JSON.stringify({ senhaAtual, senhaNova }),
      });

      if (resp.ok) {
        setMsgModal({ texto: 'Senha alterada com sucesso!', tipo: 'success' });
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

  if (carregandoPerfil) {
    return (
      <main className="container-principal">
        <p style={{ textAlign: 'center', padding: '3rem' }}>Carregando dados do perfil...</p>
      </main>
    );
  }

  return (
    <>
      <main className="container-principal">
        <section className="perfil-container">
          <div className="header-perfil">
            <div className="avatar-usuario">
              <span className="iniciais">{admin.iniciais || ''}</span>
            </div>

            <div className="info-basica">
              <h1 className="nome-usuario">{admin.nome || ''}</h1>
              {/* Removido o campo visual da matrícula para ficar apenas Nome e Email */}
              <p className="matricula-usuario">Administrador do Sistema</p> 
            </div>
          </div>

          <div className="card-perfil">
            <h2 className="titulo-secao">Informações do Administrador</h2>
            <div className="grid-dados">
              {CAMPOS_PERFIL.map(({ label, chave }) => (
                <div key={chave} className="campo-info">
                  <strong>{label}</strong>
                  <div className="valor-info">{admin[chave] || ''}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-perfil">
            <h2 className="titulo-secao">Segurança</h2>
            <p className="descricao-secao">Gerencie sua senha de acesso ao painel</p>
            <button className="btn btn-principal btn-grande" onClick={abrirModal}>
              🔐 Mudar Senha
            </button>
          </div>
        </section>
      </main>

      {modalAberto && (
        <div className="modal ativo" onClick={fecharModal}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
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
                  onChange={(e) => setSenhaAtual(e.target.value)}
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
                  onChange={(e) => setSenhaNova(e.target.value)}
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
                  onChange={(e) => setSenhaConfirm(e.target.value)}
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

export default PerfilAdm;