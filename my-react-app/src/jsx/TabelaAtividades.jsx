import React, { useState, useEffect } from 'react'
import '../css/tabelaAtividades.css'

export default function AppAtividades() {
  const [listaAtividades, setListaAtividades] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscarDadosDaApi() {
      const MOCK_ATIVIDADES = [
        { id: 1, tipo: 'Interna', nome: 'Workshop: Design Thinking', data: '15/04/2026', horas: 4 },
        { id: 2, tipo: 'Externa', nome: 'Palestra: Inovação Disruptiva', data: '10/04/2026', horas: 2 },
        { id: 3, tipo: 'Interna', nome: 'Curso: Python Avançado', data: '08/04/2026', horas: 8 },
        { id: 4, tipo: 'Externa', nome: 'Seminário: Empreendedorismo', data: '05/04/2026', horas: 3 },
        { id: 5, tipo: 'Interna', nome: 'Mentoria: Liderança', data: '02/04/2026', horas: 2 },
        { id: 6, tipo: 'Externa', nome: 'Congresso: Tecnologia e Sociedade', data: '28/03/2026', horas: 6 },
      ]

      try {
        const resp = await fetch('http://127.0.0.1:8000/api/atividades/')

        if (!resp.ok) {
          throw new Error('Erro ao buscar atividades')
        }

        const dados = await resp.json()

        const atividadesNormalizadas = Array.isArray(dados)
          ? dados.map((atividade) => ({
              id: atividade.id,
              tipo: atividade.categoria?.natureza || 'Interna',
              nome: atividade.nome_atividade || '',
              data: atividade.data || '',
              horas: atividade.horas || '',
            }))
          : []

        setListaAtividades(
          atividadesNormalizadas.length > 0 ? atividadesNormalizadas : MOCK_ATIVIDADES
        )
      } catch (error) {
        console.error('API indisponível, usando dados de demonstração:', error)
        setListaAtividades(MOCK_ATIVIDADES)
      } finally {
        setCarregando(false)
      }
    }

    buscarDadosDaApi()
  }, [])

  if (carregando) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Carregando atividades...</p>
  }

  return <TabelaAtividades atividades={listaAtividades} filtro="Todas" />
}

function TabelaAtividades({ atividades = [], filtro = 'Todas' }) {
  const atividadesFiltradas = atividades.filter((atividade) => {
    if (filtro === 'Todas') return true
    return (atividade.tipo || '').toLowerCase() === filtro.toLowerCase()
  })

  return (
    <main className="container-principal">
      <section className="atividades-container">
        <h2 className="titulo-secao">Atividades Aprovadas</h2>
        <div className="tabela-wrapper">
          <table className="tabela-atividades" role="table">
            <thead>
              <tr>
                <th scope="col">Tipo</th>
                <th scope="col">Nome da Atividade</th>
                <th scope="col">Data</th>
                <th scope="col">Horas</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {atividadesFiltradas.map((atividade, i) => {
                const tipo = atividade.tipo || 'Interna'
                const tipoLower = tipo.toLowerCase()

                return (
                  <tr key={atividade.id || i} className="linha-atividade">
                    <td>
                      <span className={`tipo-badge ${tipoLower === 'interna' ? 'interno-badge' : 'externo-badge'}`}>
                        {tipo}
                      </span>
                    </td>
                    <td className="nome-atividade">{atividade.nome}</td>
                    <td className="data">{atividade.data}</td>
                    <td className="horas">
                      {typeof atividade.horas === 'number' ? `${atividade.horas}h` : atividade.horas}
                    </td>
                    <td className="status aprovado">✓ Aprovado</td>
                  </tr>
                )
              })}

              {atividadesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                    Nenhuma atividade encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}