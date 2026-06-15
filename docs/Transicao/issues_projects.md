# Analise de Issues e Projects

Esta analise organiza o projeto a partir das issues do GitHub, com foco em tipo, prioridade, tamanho e responsavel. A consulta foi feita no repositorio `Projetos-de-Extensao/PECD1_26.1_8001_II`.

## Resumo Executivo

Foram identificadas 21 issues no repositorio. Todas estao fechadas como concluidas. A maior parte das issues nao possui labels, milestones, assignees ou campos de Project preenchidos diretamente no GitHub. Por isso, a classificacao abaixo usa inferencia a partir do titulo, corpo da issue, autor e escopo funcional.

| Indicador | Situacao |
| --- | --- |
| Total de issues | 21 |
| Issues abertas | 0 |
| Issues fechadas | 21 |
| Labels preenchidas | Nao |
| Assignees preenchidos | Nao |
| Milestones preenchidos | Nao |
| Project metadata via API | Nao identificado |

## Criterios Usados

### Tipos

- **Documentacao:** materiais de entrega, README, MkDocs, pesquisa, prototipos e apresentacoes.
- **Frontend:** telas, componentes React, dashboard, formularios e interacao.
- **Backend/API:** regras de negocio, API, autenticacao, validacoes e persistencia.
- **Gestao:** organizacao do projeto, issues, ambiente, branch e entrega.
- **Qualidade:** ajustes, conformidade, testes, revisao e melhorias tecnicas.

### Prioridades

- **Alta:** item essencial para demonstrar o fluxo principal ou entregar a AP.
- **Media:** item importante para completar experiencia e administracao.
- **Baixa:** item de apoio, acabamento ou documentacao complementar.

### Tamanhos

- **P:** tarefa pequena, geralmente documentacao simples ou ajuste pontual.
- **M:** tarefa media, envolve uma tela, componente ou documento estruturado.
- **G:** tarefa grande, envolve varios fluxos, integracao ou impacto em varias partes.

## Tabela de Issues Classificadas

| # | Issue | Tipo | Prioridade | Tamanho | Responsavel sugerido | Status |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Configurar Ambiente | Gestao | Alta | P | Guilherme-LimaIB | Concluida |
| 2 | Pesquisa | Documentacao | Alta | M | Guilherme-LimaIB | Concluida |
| 3 | Brainstorm e 5w2h | Documentacao | Alta | M | Limaaa11 | Concluida |
| 4 | Mapa Mental | Documentacao | Media | P | TheCaruzo | Concluida |
| 5 | AHT - Analise Hierarquica de Tarefas | Documentacao | Alta | M | TheCaruzo | Concluida |
| 6 | Prototipo de baixa fidelidade | Documentacao | Alta | M | TheCaruzo | Concluida |
| 7 | Historias do Usuario | Documentacao | Alta | M | TheCaruzo | Concluida |
| 8 | Apresentacao da AP1 | Documentacao | Alta | M | TheCaruzo | Concluida |
| 9 | Guilherme branch (jsx) | Frontend | Media | M | Guilherme-LimaIB | Concluida |
| 10 | Tabela Historico - Dashboard | Frontend | Alta | M | TheCaruzo | Concluida |
| 11 | Comprovante - Solicitacoes | Frontend | Alta | M | TheCaruzo | Concluida |
| 12 | Grafico de horas - Dashboard | Frontend | Alta | M | TheCaruzo | Concluida |
| 13 | Tabela Historico Geral - Solicitacoes | Frontend | Alta | M | TheCaruzo | Concluida |
| 14 | Envio Interno - Solicitacoes | Frontend / Backend | Alta | G | TheCaruzo | Concluida |
| 15 | Envio Externo - Solicitacoes | Frontend / Backend | Alta | G | TheCaruzo | Concluida |
| 16 | Criar uma tela de eventos | Frontend / Backend | Media | M | TheCaruzo | Concluida |
| 17 | Criar uma tela de cadastro | Frontend | Alta | M | TheCaruzo | Concluida |
| 18 | Tela Categoria | Frontend / Backend | Media | M | TheCaruzo | Concluida |
| 19 | Painel de gestao | Frontend / Backend | Alta | G | TheCaruzo | Concluida |
| 20 | Dashboard gerencial | Frontend / Backend | Media | G | TheCaruzo | Concluida |
| 21 | Apresentacao AP2 | Documentacao / Gestao | Alta | M | jonh-carvalho / TheCaruzo | Concluida |

## Analise por Tipo

| Tipo | Issues | Leitura |
| --- | --- | --- |
| Documentacao | #2, #3, #4, #5, #6, #7, #8, #21 | Forte presenca nas entregas academicas e na transicao para apresentacao final. |
| Frontend | #9, #10, #11, #12, #13, #16, #17, #18 | Concentracao em telas e componentes React. |
| Frontend / Backend | #14, #15, #19, #20 | Fluxos mais completos, com integracao entre tela, API e regra de negocio. |
| Gestao | #1, #21 | Organizacao de ambiente, entrega e checklist final. |

## Analise por Prioridade

| Prioridade | Issues | Justificativa |
| --- | --- | --- |
| Alta | #1, #2, #3, #5, #6, #7, #8, #10, #11, #12, #13, #14, #15, #17, #19, #21 | Itens ligados a entrega academica, fluxo principal do usuario ou demonstracao do produto. |
| Media | #4, #9, #16, #18, #20 | Itens importantes, mas menos bloqueantes que login, envio, historico e validacao. |
| Baixa | Nenhuma classificada | O conjunto de issues foi criado majoritariamente para entregas necessarias. |

## Analise por Tamanho

| Tamanho | Issues | Caracteristica |
| --- | --- | --- |
| P | #1, #4 | Baixo escopo, configuracao ou artefato pontual. |
| M | #2, #3, #5, #6, #7, #8, #9, #10, #11, #12, #13, #16, #17, #18, #21 | Entregas unitarias, geralmente uma tela, documento ou componente. |
| G | #14, #15, #19, #20 | Fluxos amplos com integracao e impacto em varias partes do sistema. |

## Responsaveis

Como as issues nao possuem `assignees` no GitHub, os responsaveis abaixo foram inferidos pelo autor da issue e pelo historico de fechamento.

| Pessoa / usuario | Papel observado | Issues associadas |
| --- | --- | --- |
| TheCaruzo | Principal executor de frontend, backend, administracao e fechamento das issues | #4 a #8, #10 a #20, fechamento de varias issues |
| Guilherme-LimaIB | Ambiente, pesquisa e branch JSX | #1, #2, #9 |
| Limaaa11 | Brainstorm e 5W2H | #3 |
| jonh-carvalho | Criacao da issue final AP2 | #21 |

## Projects

Nao foi identificado, pela API publica consultada, um GitHub Project com campos preenchidos para essas issues. A issue #21 exige o item "Projects", entao a recomendacao e estruturar um Project com as seguintes colunas e campos.

### Colunas Recomendadas

| Coluna | Uso |
| --- | --- |
| Backlog | Ideias e tarefas ainda nao iniciadas |
| To Do | Tarefas priorizadas para a sprint |
| In Progress | Tarefas em desenvolvimento |
| Review | Tarefas aguardando revisao/teste |
| Done | Tarefas concluidas |

### Campos Recomendados

| Campo | Valores sugeridos |
| --- | --- |
| Tipo | Documentacao, Frontend, Backend/API, Gestao, Qualidade |
| Prioridade | Alta, Media, Baixa |
| Tamanho | P, M, G |
| Responsavel | Usuario GitHub ou nome do integrante |
| Entrega | AP1, AP2, Final |
| Status | Backlog, To Do, In Progress, Review, Done |

### Como as issues ficariam no Project

Todas as 21 issues atuais devem ficar na coluna **Done**, pois estao fechadas. Para fins de apresentacao, o Project pode mostrar uma visao por:

- **Status:** todas em Done;
- **Tipo:** agrupando documentacao, frontend, backend/API e gestao;
- **Prioridade:** evidenciando que os itens de fluxo principal foram prioridade alta;
- **Responsavel:** mostrando a distribuicao real ou inferida do trabalho.

## Pontos de Melhoria na Gestao

- Adicionar labels padronizadas nas issues futuras.
- Preencher assignees em vez de depender apenas do autor.
- Usar milestones para AP1, AP2 e entrega final.
- Vincular issues ao GitHub Project.
- Registrar tamanho e prioridade em cada issue no momento da criacao.
- Evitar issues grandes demais sem subtarefas, especialmente painel administrativo e dashboard gerencial.

## Conclusao

O projeto possui um historico de issues suficiente para demonstrar acompanhamento e evolucao. Todas as issues estao fechadas, indicando conclusao das entregas planejadas. O principal ponto fraco nao e a ausencia de tarefas, mas a falta de padronizacao formal no GitHub: labels, assignees, milestones e Project fields nao aparecem preenchidos. A classificacao apresentada corrige essa leitura para fins de documentacao e apresentacao final.
