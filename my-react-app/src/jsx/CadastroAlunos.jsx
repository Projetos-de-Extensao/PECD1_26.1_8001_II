import { useState } from 'react';
import { apiFetch } from '../api';
import '../css/index.css';
import '../css/cadastroAlunos.css';

const FORM_INICIAL = {
  matricula: '',
  nome: '',
  email: '',
  senha: '',
  curso: '',
  anoEntrada: '2026',
  periodo: '1o Periodo',
};

const CURSOS = [
    'administração',
    'análise e desenvolvimento de sistemas',
    'arquitetura e urbanismo',
    'ciência de dados e inteligência artificial',
    'engenharia de software',
    'Ciências Contábeis',
    'Ciências Econômicas',
    'Comunicação Social - Publicidade e Propaganda',
    'Direito',
    'Engenharia da Computação',
    'Engenharia de Produção',
    'Engenharia de Software',
    'Relações Internacionais',
];

const PERIODOS = [
  '1o Periodo',
  '2o Periodo',
  '3o Periodo',
  '4o Periodo',
  '5o Periodo',
  '6o Periodo',
  '7o Periodo',
  '8o Periodo',
  '9o Periodo',
  '10o Periodo',
];

export default function CadastroAlunos({ onAlunoCriado } = {}) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [enviando, setEnviando] = useState(false);

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function validarFormulario() {
    if (!form.matricula.trim() || !form.nome.trim() || !form.email.trim() || !form.senha || !form.curso) {
      return 'Preencha todos os campos obrigatórios.';
    }

    if (!form.email.toLowerCase().endsWith('@ibmec.edu.br')) {
      return 'O e-mail do aluno deve terminar com @ibmec.edu.br.';
    }

    if (form.senha.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres.';
    }

    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setMensagem({ tipo: 'erro', texto: erroValidacao });
      return;
    }

    setEnviando(true);

    const payload = {
      ...form,
      is_funcionario: false,
    };

    try {
      const resp = await apiFetch('/api/usuarios/criar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const erroApi = data?.mensagem || data?.email?.[0] || data?.matricula?.[0] || data?.senha?.[0];
        throw new Error(erroApi || 'Não foi possível cadastrar o aluno.');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Aluno cadastrado com sucesso.' });
      setForm(FORM_INICIAL);

      if (typeof onAlunoCriado === 'function') {
        onAlunoCriado(data);
      }
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message || 'Erro ao comunicar com a API.' });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="cadastro-alunos-page">
      <section className="cadastro-alunos">
        <header className="cadastro-alunos__header">
          <span className="cadastro-alunos__tag">ALUNO</span>
          <h1>Cadastro de Alunos</h1>
          <p>Crie o registro do aluno com matrícula, e-mail institucional e dados acadêmicos.</p>
        </header>

        <form className="cadastro-alunos__form" onSubmit={handleSubmit} noValidate>
          <div className="cadastro-alunos__grid">
            <label className="cadastro-alunos__campo">
              <span>Matrícula *</span>
              <input
                type="text"
                value={form.matricula}
                onChange={(e) => atualizarCampo('matricula', e.target.value)}
                placeholder="Ex: 20260001"
                autoComplete="off"
              />
            </label>

            <label className="cadastro-alunos__campo">
              <span>Nome completo *</span>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => atualizarCampo('nome', e.target.value)}
                placeholder="Nome do aluno"
                autoComplete="name"
              />
            </label>

            <label className="cadastro-alunos__campo">
              <span>E-mail institucional *</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => atualizarCampo('email', e.target.value)}
                placeholder="aluno@ibmec.edu.br"
                autoComplete="email"
              />
            </label>

            <label className="cadastro-alunos__campo">
              <span>Senha inicial *</span>
              <input
                type="password"
                value={form.senha}
                onChange={(e) => atualizarCampo('senha', e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
            </label>

            <label className="cadastro-alunos__campo cadastro-alunos__campo--inteiro">
              <span>Curso *</span>
              <select value={form.curso} onChange={(e) => atualizarCampo('curso', e.target.value)}>
                <option value="">Selecione um curso</option>
                {CURSOS.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </select>
            </label>

            <label className="cadastro-alunos__campo">
              <span>Ano de entrada</span>
              <input
                type="number"
                value={form.anoEntrada}
                onChange={(e) => atualizarCampo('anoEntrada', e.target.value)}
                min="2000"
                max="2100"
              />
            </label>

            <label className="cadastro-alunos__campo">
              <span>Período</span>
              <select value={form.periodo} onChange={(e) => atualizarCampo('periodo', e.target.value)}>
                {PERIODOS.map((periodo) => (
                  <option key={periodo} value={periodo}>
                    {periodo}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {mensagem.texto && (
            <div className={`cadastro-alunos__mensagem cadastro-alunos__mensagem--${mensagem.tipo}`} role="status">
              {mensagem.texto}
            </div>
          )}

          <div className="cadastro-alunos__acoes">
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => {
                setForm(FORM_INICIAL);
                setMensagem({ tipo: '', texto: '' });
              }}
              disabled={enviando}
            >
              Limpar
            </button>
            <button type="submit" className="btn btn-principal" disabled={enviando}>
              {enviando ? 'Cadastrando...' : 'Cadastrar aluno'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
