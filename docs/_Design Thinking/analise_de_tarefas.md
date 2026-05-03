## Análise Hierárquica de Tarefas (AHT)

A análise hierárquica de tarefas (AHT) é uma técnica utilizada para decompor e entender as atividades que um usuário realiza ao interagir com uma aplicação ou sistema. Sua principal função é detalhar, de forma estruturada, as metas, tarefas e ações envolvidas no uso do produto AAC (Atividades Acadêmicas Complementares), permitindo identificar pontos críticos, oportunidades de melhoria e necessidades específicas das personas.

## **1. Objetivo da Análise de Tarefas** 

- Compreender o fluxo de trabalho dos usuários (Aluno, Avaliador, Coordenação), desde as metas gerais até as ações mais específicas.
- Identificar possíveis dificuldades, redundâncias ou etapas desnecessárias no processo de registro e validação de AAC.
- Apoiar o design de interfaces mais intuitivas e eficientes, alinhadas às necessidades reais dos usuários.
- Facilitar a comunicação entre equipes de desenvolvimento, design e stakeholders, tornando claro o que precisa ser atendido pela aplicação AAC sistema.

## **2. Público-Alvo (Personas)**

### Persona 1: Aluno
- **Nome:** João (Aluno de Graduação)
- **Descrição:** Aluno do IBMEC que precisa cumprir horas de Atividades Acadêmicas Complementares para conclusão do curso.
- **Necessidades:** Registrar horas rapidamente, acompanhar progresso, enviar comprovantes, receber validação.
- **Objetivos:** Cumprir meta de AAC (interno + externo), concluir course sem bloqueio de colação.

### Persona 2: Avaliador/Funcionário
- **Nome:** Maria (Funcionária CASA/Validação)
- **Descrição:** Funcionária responsável por validar solicitações de atividades externas e gerenciar a fila.
- **Necessidades:** Visualizar solicitações pendentes, avaliar comprovantes, aprovar/rejeitar com justificativa, gerenciar prazos.
- **Objetivos:** Processar validações com qualidade, reduzir tempo de fila, garantir conformidade com regras do IBMEC.

### Persona 3: Coordenação
- **Nome:** Prof. Carlos (Coordenador de AAC)
- **Descrição:** Coordenador responsável por definir regras, monitorar SLA e acompanhar indicadores.
- **Necessidades:** Configurar limites por atividade, monitorar fila de validações, gerar relatórios, acompanhar riscos.
- **Objetivos:** Garantir cumprimento de regras, reduzir fraudes, garantir que alunos atinjam meta, fechar semestre.

## **3. Metas da Aplicação**

- **Meta 1:** Permitir que alunos registrem e acompanhem AAC de forma rápida e intuitiva
- **Meta 2:** Validar automaticamente atividades internas (QR Code) e manualmente as externas com eficiência
- **Meta 3:** Gerar relatórios e garantir conformidade com regras do MEC e IBMEC

## **4. Tarefas Principais**

| Tarefa | Descrição | Persona Responsável |
|--------|-----------|-------------------|
| **Autenticação** | Realizar login na plataforma com email educacional (aluno) ou corporativo (funcionário) | Aluno, Avaliador, Coordenação |
| **Registrar Atividade Interna** | Escanear QR Code em evento CASA, validação automática e registro de horas | Aluno |
| **Registrar Atividade Externa** | Enviar comprovante, preencher dados (tipo, carga horária, entidade), submeter para validação | Aluno |
| **Validar Atividade Externa** | Revisar solicitação, avaliar documentos, aprovar/rejeitar com motivo e comunicar ao aluno | Avaliador |
| **Acompanhar Progresso** | Visualizar dashboard com total necessário, horas realizadas, restantes, segregado por tipo (interno/externo) | Aluno |
| **Gerenciar Regras** | Definir limites por atividade, eixos (Ensino/Pesquisa/Extensão), prazos e critérios de aceitação | Coordenação |
| **Monitorar Fila** | Acompanhar solicitações pendentes, SLA, risco de atraso, gargalos | Coordenação |
| **Gerar Relatórios** | Produzir relatórios automáticos de horas, taxa de validação, alunos com risco de bloqueio | Avaliador, Coordenação |

## **5. Ações Detalhadas**

### Tarefa: Registrar Atividade Interna (Aluno)

1. **Ação 1:** Acesso ao sistema → Menu principal
2. **Ação 2:** Seleciona "Registrar Atividade Interna"
3. **Ação 3:** Aproxima dispositivo do QR Code disponível no evento
4. **Ação 4:** Sistema valida automaticamente e extrai: evento, data, hora, tipo
5. **Ação 5:** Aluno confirma informações (nome, carga horária, eixo)
6. **Ação 6:** Sistema registra horas instantaneamente e exibe confirmação
7. **Ação 7:** Aluno retorna ao dashboard (horas atualizadas)

---

### Tarefa: Registrar Atividade Externa (Aluno)

1. **Ação 1:** Acesso ao sistema → Menu principal
2. **Ação 2:** Seleciona "Registrar Atividade Externa"
3. **Ação 3:** Escolhe tipo de atividade (Curso, Palestra, Workshop, Voluntariado, etc.)
4. **Ação 4:** Preenche formulário (entidade emissora, carga horária, data)
5. **Ação 5:** Faz upload de comprovante (certificado, atestado, carta de participação)
6. **Ação 6:** Aluno revisa dados e clica em "Enviar para Validação"
7. **Ação 7:** Sistema coloca solicitação na fila e exibe status
8. **Ação 8:** Aluno recebe notificação quando validação for concluída

---

### Tarefa: Validar Atividade Externa (Avaliador)

1. **Ação 1:** Acesso ao sistema → Dashboard de Validações
2. **Ação 2:** Visualiza fila de solicitações pendentes (filtros: por aluno, tipo, data)
3. **Ação 3:** Seleciona uma solicitação para revisar
4. **Ação 4:** Valida dados: entidade emissora, carga horária, comprovante (verifica conformidade com regras)
5. **Ação 5:** Verifica limites por categoria (ex: estágio ≤ 100h, idiomas ≤ 30h)
6. **Ação 6:** Toma decisão: Aprova, Rejeita ou Solicita Ajuste
7. **Ação 7:** Escreve justificativa se rejeitar
8. **Ação 8:** Sistema notifica aluno e atualiza dashboard

---

### Tarefa: Acompanhar Progresso (Aluno)

1. **Ação 1:** Acesso ao Dashboard
2. **Ação 2:** Visualiza card: Total necessário, Horas realizadas, Horas restantes, % de progresso
3. **Ação 3:** Vê segregação: Horas Internas vs Horas Externas (gráficos)
4. **Ação 4:** Vê sub-categorias por tipo: Cursos, Palestras, Workshops, Voluntariado, etc.
5. **Ação 5:** Acessa Histórico com lista de todas as atividades (aprovadas, pendentes, rejeitadas)
6. **Ação 6:** Clica em atividade para ver detalhes (datas, status, documentos)

---

### Tarefa: Gerenciar Regras (Coordenação)

1. **Ação 1:** Acesso ao sistema → Menu Administração
2. **Ação 2:** Seleciona "Configurar Regras"
3. **Ação 3:** Define limites globais: total de horas, eixos (Ensino/Pesquisa/Extensão)
4. **Ação 4:** Define limites por categoria: Estágio (100h), Monitoria (100h), Idiomas (30h), TCC (10h)
5. **Ação 5:** Define critérios de aceitação: exigências para dados externos (entidade, QR/link, etc.)
6. **Ação 6:** Define prazos: fechamento de período, alertas de risco, bloqueio de colação
7. **Ação 7:** Salva configuração e visualiza resumo

---

## **6. Observações**

- O registro de atividades internas (QR Code) é instantâneo e automático, reduzindo carga manual.
- O registro de atividades externas requer validação manual, mas com regras pré-configuradas para agilizar.
- Notificações são críticas para manter aluno informado sobre status de validação.
- Dashboard deve mostrar progresso real em tempo real para motivar cumprimento de metas.
- Coordenação deve ter visibilidade total de KPIs e riscos para fechar semestre sem bloqueios.