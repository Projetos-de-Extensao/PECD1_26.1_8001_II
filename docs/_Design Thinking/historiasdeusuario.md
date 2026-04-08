---
id: historia_de_usuario
title: História de Usuário
---

## Scrum

### Introdução

Histórias de usuário são uma técnica comum no desenvolvimento ágil de software para descrever funcionalidades sob a perspectiva do usuário final. Elas ajudam a entender quem usará o sistema, o que deseja fazer e qual benefício espera obter. Em vez de documentos extensos, histórias de usuário são curtas, centradas no valor entregue, e servem como base para discussão e refinamento contínuo durante o projeto.

Uma história de usuário típica segue a estrutura:

> "Como um [tipo de usuário], eu quero [ação desejada] para [objetivo/benefício]."

Essa abordagem garante que o foco permaneça nas necessidades reais dos usuários, incentivando o desenvolvimento interativo e colaborativo.

---

### Metodologia

A criação e o uso de histórias de usuário geralmente seguem esta metodologia:

1. **Identificação dos perfis de usuários**: Primeiro, é essencial listar quem são os usuários do sistema, suas características e necessidades gerais.

2. **Escrita das histórias**: Cada funcionalidade importante é escrita na forma de uma história curta, clara e focada no objetivo do usuário.

3. **Categorização e Priorização**: As histórias são agrupadas por temas ou funcionalidades principais e priorizadas com base no valor de negócio e na necessidade do usuário.

4. **Discussão e Refinamento**: Antes do desenvolvimento, as histórias são discutidas entre equipe técnica, stakeholders e usuários para garantir entendimento comum e ajustes conforme necessário.

5. **Aceitação e Critérios de Conclusão**: Cada história é complementada com critérios de aceitação, que definem o que precisa ser entregue para considerar a história "pronta".

6. **Implementação Iterativa**: Durante o desenvolvimento ágil (por exemplo, em Sprints no Scrum), as histórias priorizadas são implementadas, testadas e revisadas com feedback contínuo.

## Histórias de Usuário - Versão 1.0

### Épico 1: Autenticação e Acesso

#### US001 - Login do Aluno
- **Como um** aluno
- **Eu quero** fazer login com meu email educacional
- **Para** acessar minha conta e visualizar meu progresso de AAC

**Critérios de Aceitação:**
- O sistema deve aceitar email educacional (@ibmec.edu.br)
- Deve exigir senha válida
- Deve exibir mensagem de erro para credenciais inválidas
- Deve redirecionar para o dashboard após login bem-sucedido
- Deve manter sessão por 30 minutos de inatividade

---

#### US002 - Login do Funcionário/Avaliador
- **Como um** funcionário/avaliador
- **Eu quero** fazer login com meu email corporativo
- **Para** acessar o sistema de validação de atividades externas

**Critérios de Aceitação:**
- O sistema deve aceitar email corporativo (@ibmec.br)
- Deve exigir senha válida
- Deve exibir dashboard diferenciado para funcionários
- Deve permitir acesso apenas a solicitações pendentes

---

### Épico 2: Atividades Internas (QR Code)

#### US003 - Registrar Atividade Interna via QR Code
- **Como um** aluno
- **Eu quero** escanear um QR Code em um evento da CASA
- **Para** registrar automaticamente minha participação e ganhar horas de AAC

**Critérios de Aceitação:**
- O sistema deve abrir câmera ao selecionar "Registrar Atividade Interna"
- Deve ler e validar o QR Code do evento
- Deve extrair automaticamente: evento, data, hora, tipo
- Deve registrar horas instantaneamente
- Deve exibir confirmação com detalhes da atividade registrada

---

#### US004 - Confirmar Dados de Atividade Interna
- **Como um** aluno
- **Eu quero** revisar e confirmar os dados da atividade interna antes do registro
- **Para** garantir que as informações estão corretas

**Critérios de Aceitação:**
- Deve exibir card com: evento, data, hora, carga horária, eixo
- Deve permitir confirmar ou cancelar o registro
- Se confirmado, horas devem ser adicionadas ao total
- Se cancelado, deve retornar ao menu inicial

---

### Épico 3: Atividades Externas (Comprovante)

#### US005 - Registrar Atividade Externa
- **Como um** aluno
- **Eu quero** enviar um comprovante de atividade externa
- **Para** ter minha participação validada e horas contabilizadas

**Critérios de Aceitação:**
- Deve permitir selecionar tipo de atividade (Curso, Palestra, Workshop, Voluntariado)
- Deve exigir: entidade emissora, carga horária, data
- Deve aceitar upload de PDF, PNG, JPG com limite de 5MB
- Deve exibir preview do arquivo antes de enviar
- Deve colocar solicitação na fila para análise

---

#### US006 - Validar Atividade Externa
- **Como um** funcionário/avaliador
- **Eu quero** revisar e validar solicitações de atividades externas
- **Para** garantir conformidade com as regras do IBMEC

**Critérios de Aceitação:**
- Deve exibir fila de solicitações pendentes (página 1 com 10 itens)
- Deve permitir filtrar por: aluno, tipo, data
- Deve exibir: dados da atividade, comprovante, justificativa do aluno
- Deve permitir: Aprovar, Rejeitar ou Solicitar Ajuste
- Deve exigir justificativa se rejeitar
- Deve notificar aluno após decisão

---

#### US007 - Verificar Limites de Categoria
- **Como um** sistema
- **Eu quero** validar se o aluno não ultrapassou o limite de horas por categoria
- **Para** garantir conformidade com as regras do IBMEC

**Critérios de Aceitação:**
- Deve verificar limite: Estágio ≤ 100h, Monitoria ≤ 100h, Idiomas ≤ 30h, TCC ≤ 10h
- Deve permitir aprovação dentro do limite
- Deve rejeitar automaticamente se ultrapassar limite
- Deve exibir mensagem clara do motivo da rejeição

---

### Épico 4: Dashboard e Acompanhamento

#### US008 - Visualizar Progresso de Horas
- **Como um** aluno
- **Eu quero** visualizar meu progresso de horas em tempo real
- **Para** acompanhar se estou no caminho para cumprir a meta

**Critérios de Aceitação:**
- Deve exibir: Total necessário (120h), Horas realizadas, Horas restantes, % de progresso
- Deve usar barra de progresso visual
- Deve atualizar em tempo real após cada registro
- Dados devem ser precisos e sincronizados

---

#### US009 - Segregar Horas Internas e Externas
- **Como um** aluno
- **Eu quero** ver minha segregação entre horas internas e externas
- **Para** garantir que estou distribuindo bem minhas atividades

**Critérios de Aceitação:**
- Deve exibir dois cards: "Horas Internas (QR Code)" e "Horas Externas (Comprovantes)"
- Cada card deve mostrar: X / Y horas e % de progresso
- Deve atualizar quando novas horas são registradas
- Deve permitir clicar para expandir detalhes

---

#### US010 - Visualizar Histórico de Atividades
- **Como um** aluno
- **Eu quero** visualizar o histórico completo de minhas atividades
- **Para** verificar detalhes, status e documentos de cada atividade

**Critérios de Aceitação:**
- Deve exibir lista com: data, tipo, entidade, carga horária, status
- Deve permitir filtrar por: tipo, status, período
- Deve permitir clicar para expandir e ver: documentos, observações, data de aprovação
- Deve exibir ícone indicando status: ✓ Aprovado, ⏳ Pendente, ✗ Rejeitado

---

#### US011 - Categorizar Atividades por Tipo
- **Como um** aluno
- **Eu quero** ver minhas horas categorizadas por tipo de atividade
- **Para** entender em quais áreas estou investindo tempo

**Critérios de Aceitação:**
- Deve exibir breakdown: Cursos, Palestras, Workshops, Voluntariado, Monitoria, Estágio
- Cada categoria deve mostrar: horas realizadas e limite (se houver)
- Deve usar cores diferentes para cada categoria
- Deve permitir clicar para filtrar o histórico por categoria

---

### Épico 5: Notificações

#### US012 - Notificar Status de Validação
- **Como um** aluno
- **Eu quero** receber notificação quando minha atividade externa for validada
- **Para** saber o resultado sem precisar ficar verificando

**Critérios de Aceitação:**
- Deve enviar notificação (in-app + email) quando aprovada ou rejeitada
- Deve incluir: tipo da atividade, resultado, motivo (se rejeitado)
- Deve aparecer no topo do dashboard como alerta
- Deve permitir dismissar a notificação

---

#### US013 - Alertar sobre Prazo de Cumprimento
- **Como um** aluno
- **Eu quero** receber alerta quando faltarem 30 dias para terminar o semestre
- **Para** ter tempo de completar minhas horas de AAC

**Critérios de Aceitação:**
- Deve enviar notificação 30 dias antes do fechamento
- Deve informar: horas restantes, atividades pendentes
- Deve permitir consultar calendário de prazos
- Deve aparecer como banner alerta no dashboard

---

## Conclusão

<p align = "justify">
As histórias de usuário foram estruturadas com base nas personas identificadas (Aluno, Avaliador, Coordenação) e nas funcionalidades mapeadas no Brainstorm, Análise de Tarefas e Protótipo. Cada história inclui critérios de aceitação claros para facilitar o desenvolvimento iterativo no Scrum. O conjunto de 13 histórias cobre os fluxos principais: autenticação, registro de atividades (internas e externas), acompanhamento de progresso e notificações.
</p>