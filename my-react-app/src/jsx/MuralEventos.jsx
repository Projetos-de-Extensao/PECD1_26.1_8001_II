import React, { useState, useEffect } from 'react';
import '../css/muralEventos.css';

export default function MuralEventos() {
  const [eventos, setEventos] = useState([]);
  const [slideAtual, setSlideAtual] = useState(0);

  useEffect(() => {
    // Simulando a busca de eventos em destaque do Banco de Dados
    setEventos([
      { 
        id: 1, titulo: 'Semana da Computação IBMEC', data: '15/05/2026', horas: 20, tipo: 'Interno', 
        cor: 'linear-gradient(135deg, #002555 0%, #004b99 100%)' // Azul Institucional
      },
      { 
        id: 2, titulo: 'Palestra: IA e o Futuro do Trabalho', data: '20/05/2026', horas: 3, tipo: 'Externo', 
        cor: 'linear-gradient(135deg, #F5AC00 0%, #ff8800 100%)' // Amarelo/Laranja
      },
      { 
        id: 3, titulo: 'Workshop de Design Thinking Avançado', data: '10/06/2026', horas: 5, tipo: 'Interno', 
        cor: 'linear-gradient(135deg, #1f8b4c 0%, #2db965 100%)' // Verde Sucesso
      }
    ]);
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
      <div className="mural-header">
        <h2>Eventos</h2>
        <p>Participe de eventos disponíveis e garanta suas horas complementares (AAC)</p>
      </div>
      
      <div className="carrossel">
        <button className="btn-controle prev" onClick={slideAnterior}>&#10094;</button>
        
        {/* Trilho que desliza os slides */}
        <div className="carrossel-track" style={{ transform: `translateX(-${slideAtual * 100}%)` }}>
          {eventos.map((evento) => (
            <div className="carrossel-slide" key={evento.id} style={{ background: evento.cor }}>
              <div className="slide-conteudo">
                <span className="badge-tipo">{evento.tipo}</span>
                <h3>{evento.titulo}</h3>
                <div className="slide-infos">
                  <span>🗓️ {evento.data}</span>
                  <span>⏱️ Garanta {evento.horas}h</span>
                </div>
                <button className="btn-inscrever">Quero Participar</button>
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
