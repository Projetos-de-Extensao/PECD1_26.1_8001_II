import React, { useState, useEffect, useRef } from 'react';
import '../css/FormExterno.css';

export default function FormExterno({ ativo }) {
  // Estados para gerenciar as categorias vindas do Banco de Dados
  const [listaCategorias, setListaCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);

  // Estados do formulário
  const [categoria, setCategoria] = useState('');
  const [arquivoInfo, setArquivoInfo] = useState(null);
  const [mensagemEnvio, setMensagemEnvio] = useState('');
  
  const formRef = useRef(null); // Referência para acessar e limpar o formulário facilmente

  // ==========================================
  // 1. BUSCAR CATEGORIAS DO BANCO (GET)
  // ==========================================
  useEffect(() => {
    async function carregarCategorias() {
      try {
        // Rota da sua API que lista as categorias cadastradas
        const resposta = await fetch('/api/categorias-externas');
        
        if (!resposta.ok) throw new Error('Falha ao carregar categorias');
        
        const dados = await resposta.json();
        setListaCategorias(dados); // Salva as categorias no estado
        
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
    setArquivoInfo(f ? { name: f.name, size: f.size } : null);
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

    try {
      // O FormData captura todos os inputs com atributo 'name' dentro do formRef
      const pacoteDados = new FormData(formRef.current);
      
      // Enviamos o pacote para a API. 
      // IMPORTANTE: NÃO coloque 'Content-Type' no headers. O navegador faz isso automaticamente para arquivos.
      const resposta = await fetch('/api/solicitacoes/externa', {
        method: 'POST',
        body: pacoteDados,
      });

      if (!resposta.ok) throw new Error('Falha ao enviar arquivo');

      setMensagemEnvio('✓ Solicitação enviada e salva com sucesso!');
      
      // Limpa o formulário após o sucesso
      setTimeout(() => {
        handleLimparExterno();
      }, 2000);

    } catch (erro) {
      console.error(erro);
      setMensagemEnvio('✗ Erro ao salvar solicitação. Tente novamente.');
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
              name="categoriaId" // O backend vai receber esse nome
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
                <input id="curso" name="titulo" type="text" placeholder="Ex: Semana da Computação" required />
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
                  name="certificado" // O backend vai procurar por esse nome no Multer/Upload
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleArquivoChange} 
                  required 
                />
                <div id="nomeArquivo" className="arquivo-info" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                  {arquivoInfo ? `📄 ${arquivoInfo.name}` : 'Nenhum arquivo selecionado'}
                </div>
              </div>
            </div>

            <div className="acoes" style={{ marginTop: '2rem' }}>
              <button id="btnEnviar" type="submit" className="btn btn-principal">Enviar para Aprovação</button>
              <button id="btnLimpar" type="button" className="btn btn-secundario" onClick={handleLimparExterno}>Limpar</button>
            </div>
          </div>
        </form>

        <div id="mensagem" role="status" aria-live="polite" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          {mensagemEnvio}
        </div>
      </div>
    </div>
  );
}