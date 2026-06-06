import React, { useState, useEffect } from 'react';
import '../css/muralEventos.css';

export default function MuralEventos() {
  const [eventos, setEventos] = useState([]);
  const [slideAtual, setSlideAtual] = useState(0);

  useEffect(() => {
    async function buscarEventos() {
      try {
        const resposta = await fetch('http://localhost:8000/api/eventos/lista/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!resposta.ok) throw new Error('Falha ao buscar eventos da API');

        const dados = await resposta.json();

        // Paleta de cores para enfeitar os slides
        const paletaCores = [
          'linear-gradient(135deg, #002555 0%, #004b99 100%)', // Azul Institucional
          'linear-gradient(135deg, #F5AC00 0%, #ff8800 100%)', // Amarelo/Laranja
          'linear-gradient(135deg, #1f8b4c 0%, #2db965 100%)', // Verde Sucesso
          'linear-gradient(135deg, #6f42c1 0%, #8950d6 100%)'  // Roxo
        ];

        // Filtra apenas eventos ativos e formata os nomes pro Layout React
        const eventosFormatados = dados
          .filter(evento => evento.ativo !== false)
          .map((evento, index) => ({
            id: evento.id_evento,
            titulo: evento.nome,
            data: evento.data,
            hora: evento.hora || '',
            horas: evento.horas,
            tipo: 'Interno',
            categoria: evento.categoria,
            palestrante: evento.palestrante || '',
            cursoAlvo: evento.curso_alvo || '',
            unidade: evento.unidade || '',
            cor: paletaCores[index % paletaCores.length]
          }));

        setEventos(eventosFormatados);
      } catch (error) {
        console.error('Erro ao carregar o mural de eventos:', error);
      }
    }

    buscarEventos();
  }, []);

  // Efeito para trocar o slide automaticamente a cada 5 segundos
  useEffect(() => {
    if (eventos.length === 0) return;
    const intervalo = setInterval(() => {
      setSlideAtual((prev) => (prev === eventos.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    // Limpa o intervalo caso o usuário saia da tela
    return () => clearInterval(intervalo);
  }, [eventos.length]);

  const proximoSlide = () => {
    setSlideAtual(slideAtual === eventos.length - 1 ? 0 : slideAtual + 1);
  };

  const slideAnterior = () => {
    setSlideAtual(slideAtual === 0 ? eventos.length - 1 : slideAtual - 1);
  };

  if (eventos.length === 0) return null;

  return (
    <div className="mural-container">
      <div className="carrossel">
        <button className="btn-controle prev" onClick={slideAnterior}>&#10094;</button>
        
        {/* Trilho que desliza os slides */}
        <div className="carrossel-track" style={{ transform: `translateX(-${slideAtual * 100}%)` }}>
          {eventos.map((evento) => (
            <div className="carrossel-slide" key={evento.id} style={{ background: evento.cor }}>
              <div className="slide-conteudo">
                
                <div className="badge-grupo">
                  <span className="badge-item badge-categoria">{evento.categoria}</span>
                </div>
                
                <h3>{evento.titulo}</h3>
                
                <div className="slide-infos">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🗓️ {evento.data} às {evento.hora}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⏱️ {evento.horas}h AAC</span>
                </div>
                
                <div className="grid-detalhes">
                  {evento.palestrante && (
                    <div className="card-detalhe">
                      <div className="icone-detalhe roxo">🗣️</div>
                      <div className="texto-detalhe"><span className="rotulo">Palestrante</span><span className="valor">{evento.palestrante}</span></div>
                    </div>
                  )}
                  
                  {evento.cursoAlvo && (
                    <div className="card-detalhe">
                      <div className="icone-detalhe azul">🎯</div>
                      <div className="texto-detalhe"><span className="rotulo">Curso Alvo</span><span className="valor">{evento.cursoAlvo}</span></div>
                    </div>
                  )}
                  
                  {evento.unidade && (
                    <div className="card-detalhe">
                      <div className="icone-detalhe laranja">📍</div>
                      <div className="texto-detalhe"><span className="rotulo">Unidade</span><span className="valor">{evento.unidade}</span></div>
                    </div>
                  )}
                </div>
                
                <button className="btn-inscrever">Garantir Minha Vaga</button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-controle next" onClick={proximoSlide}>&#10095;</button>

        {/* Indicadores (Bolinhas) */}
        <div className="carrossel-indicadores">
          {eventos.map((_, index) => (
            <span 
              key={index} 
              className={`indicador ${index === slideAtual ? 'ativo' : ''}`}
              onClick={() => setSlideAtual(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
