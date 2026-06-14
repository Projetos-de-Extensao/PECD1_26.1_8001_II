import React, { useState, useEffect, useRef } from 'react';
import '../css/FormExterno.css';
import { apiFetch, apiJson } from '../api';
import Comprovante from './Comprovante.jsx'; // Importa o componente de comprovante para mostrar o resultado da solicitação externa

export default function FormExterno({ ativo }) {
  // Estados para gerenciar as categorias vindas do Banco de Dados
  const [listaCategorias, setListaCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);

  // Estados do formulário
  const [categoria, setCategoria] = useState('');
  const [arquivoInfo, setArquivoInfo] = useState(null);
  const [mensagemEnvio, setMensagemEnvio] = useState('');
  const [comprovanteId, setComprovanteId] = useState(null);
  const [isEnviando, setIsEnviando] = useState(false);
  
  const formRef = useRef(null); // Referência para acessar e limpar o formulário facilmente

  // ==========================================
  // 1. BUSCAR CATEGORIAS DO BANCO (GET)
  // ========================================== que fp foi enviado componente  comprovante dvee pa
  useEffect(() => {
    async function carregarCategorias() {
      try {
        const dados = await apiJson('/api/categorias/lista/');
        
        // Filtro mais flexível: cobre várias formas que o banco (SQLite/Postgres) pode
        // retornar a coluna "tipo" para atividades externas (false, 0, 'False', ou 'Externa')
        let categoriasExternas = dados
          .filter(item => !item.tipo || String(item.tipo).toLowerCase() === 'false' || item.tipo === 'Externa')
          .map(item => ({ 
            id: item.id_categoria || item.id, 
            nome: item.atividade ? `${item.categoria} - ${item.atividade}` : item.nome || 'Categoria Externa' 
          }));
          
        // Se o filtro for muito restrito e não sobrar nada (mas existirem dados na API), 
        // libera todas as categorias para evitar que o select fique em branco.
        if (categoriasExternas.length === 0 && dados.length > 0) {
          categoriasExternas = dados.map(item => ({ id: item.id_categoria || item.id, nome: item.atividade ? `${item.categoria} - ${item.atividade}` : item.nome || 'Categoria Geral' }));
        }

        setListaCategorias(categoriasExternas);
        
      } catch (erro) {
        console.error('Erro na API de categorias:', erro);
        setMensagemEnvio('⚠ Não foi possível carregar as categorias.');
        
        // Opcional: Fallback de categorias caso a API falhe temporariamente
        setListaCategorias([
          { id: '1', nome: 'Palestra' },
          { id: '2', nome: 'Workshop' },
          { id: '3', nome: 'Curso' }
        ]);
      } finally {
        setCarregandoCategorias(false);
      }
    }

    carregarCategorias();
  }, []); // Array vazio garante que só rode uma vez ao carregar a tela

  // ==========================================
  // 2. MANUSEIO DE ARQUIVOS
  // ==========================================
  function handleArquivoChange(e) {
    const f = e.target.files?.[0] ?? null;
    
    if (f) {
      // Limite de 5MB (5 * 1024 * 1024 bytes) conforme a História de Usuário (US005)
      if (f.size > 5 * 1024 * 1024) {
        alert('O arquivo selecionado é muito grande. O limite máximo é de 5MB.');
        e.target.value = ''; // Limpa o input
        setArquivoInfo(null);
        return;
      }
      setArquivoInfo({ name: f.name, size: f.size });
    } else {
      setArquivoInfo(null);
    }
  }

  function handleLimparExterno() {
    setCategoria('');
    setArquivoInfo(null);
    setMensagemEnvio('');
    if (formRef.current) formRef.current.reset(); // Limpa todos os inputs
  }

  // ==========================================
  // 3. ENVIO PARA O BANCO DE DADOS (POST COM ARQUIVO)
  // ==========================================
  async function handleEnviarExterno(e) {
    e.preventDefault();
    
    // Validação básica
    if (!arquivoInfo) {
      setMensagemEnvio('⚠ Por favor, anexe o PDF do certificado.');
      return;
    }

    setMensagemEnvio('Enviando documentos...');
    setIsEnviando(true);

    try {
      const usuarioSalvo = localStorage.getItem('usuario');
      if (!usuarioSalvo) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }
      const usuarioLogado = JSON.parse(usuarioSalvo);

      // O FormData captura todos os inputs com atributo 'name' dentro do formRef
      const pacoteDados = new FormData(formRef.current);
      
      const resposta = await apiFetch('/api/solicitacoes/criar-externa/', {
        method: 'POST',
        body: pacoteDados,
      });

      if (!resposta.ok) throw new Error('Falha ao enviar arquivo');

      const dados = await resposta.json();

      setMensagemEnvio('✓ Solicitação enviada e salva com sucesso!');
      
      setComprovanteId(dados.id_solicitacao);
      handleLimparExterno();
    } catch (erro) {
      console.error(erro);
      setMensagemEnvio('✗ Erro ao salvar solicitação. Tente novamente.');
    } finally {
      setIsEnviando(false);
    }
  }

  // ==========================================
  // 4. RENDERIZAÇÃO DA TELA
  // ==========================================
  return (
    <div id="form-externo" className={`formulario ${ativo ? 'ativo' : ''}`}>
      <div className="painel-envio">
        <h2 className="titulo-form">Solicitação Externa</h2>
        <p className="subtitulo-form">Envie documentos de eventos externos para avaliação</p>

        <form ref={formRef} onSubmit={handleEnviarExterno} noValidate>
          
          {/* SELECT DINÂMICO (Vem da API) */}
          <div className="campo-select-wrapper" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="categoria">Categoria do Evento</label>
            <select 
              id="categoria" 
              name="categoria" 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">
                {carregandoCategorias ? 'Carregando...' : '— Escolha uma categoria —'}
              </option>
              
              {listaCategorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {/* O form só aparece se a pessoa escolher uma categoria */}
          <div className={`form-oculto ${categoria !== '' ? 'visivel' : 'escondido'}`} style={{ display: categoria !== '' ? 'block' : 'none' }}>
            <div className="form-rows">
              
              <div className="campo">
                <label htmlFor="curso">Título do Evento</label>
                <input id="curso" name="nome_atividade" type="text" placeholder="Ex: Semana da Computação" required />
              </div>

              <div className="campo">
                <label htmlFor="data">Data de Conclusão</label>
                <input id="data" name="data" type="date" required />
              </div>

              <div className="campo">
                <label htmlFor="duracao">Carga Horária</label>
                <input id="duracao" name="horas" type="number" min="1" step="0.5" required />
              </div>

              {/* UPLOAD DE ARQUIVO */}
              <div className="campo">
                <label htmlFor="arquivo">Anexar Certificado (PDF)</label>
                <input 
                  id="arquivo" 
                  name="arquivo" 
                  type="file" 
                accept="application/pdf, image/png, image/jpeg" 
                  onChange={handleArquivoChange} 
                  required 
                />
                <div id="nomeArquivo" className="arquivo-info" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                  {arquivoInfo ? `📄 ${arquivoInfo.name}` : 'Nenhum arquivo selecionado'}
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>Máx: 5MB (PDF, PNG, JPG)</span>
                </div>
              </div>
            </div>

            <div className="acoes" style={{ marginTop: '2rem' }}>
            <button id="btnEnviar" type="submit" className="btn btn-principal" disabled={isEnviando}>
              {isEnviando ? 'Enviando...' : 'Enviar para Aprovação'}
            </button>
              <button id="btnLimpar" type="button" className="btn btn-secundario" onClick={handleLimparExterno}>Limpar</button>
            </div>
          </div>
        </form>

        <div id="mensagem" role="status" aria-live="polite" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          {mensagemEnvio}
        </div>
      </div>

      {/* MODAL DE COMPROVANTE */}
      {comprovanteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 37, 85, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }} onClick={() => setComprovanteId(null)}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '600px', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: 'slideDown 0.3s ease-out', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, color: 'var(--cor-secundaria)', fontSize: '1.2rem' }}>Comprovante de Solicitação</h3>
              <button onClick={() => setComprovanteId(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>✖</button>
            </div>
            <div style={{ overflowY: 'auto' }}>
              <Comprovante idSolicitacao={comprovanteId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

