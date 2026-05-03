---
id: brainstorm
title: Brainstorm
---
 
## Introdução
<p align = "justify">
O brainstorm é uma técnica de elicitação de requisitos que consiste em reunir a equipe e discutir sobre diversos tópicos gerais do projeto apresentados no documento problema de negócio. No brainstorm o diálogo é incentivado e críticas são evitadas para permitir que todos colaborem com suas próprias ideias.
</p>
 
## Metodologia
<p align = "justify">
A equipe se reuniu para debater ideias gerais sobre o projeto via..., começou .... e terminou..., onde o XXXX XXXX foi o moderador, direcionando a equipe com questões pré-elaboradas, e transcrevendo as respostas para o documento.
</p>
 
## Brainstorm
 
## Versão 1.0
 
## Perguntas
 
### 1. Qual o objetivo principal da aplicação?
 
<p align = "justify">
<b>Antonni Carvalho</b> - Deve ser uma plataforma onde será realizado o acompanhamento e cadastramento de AAC.
</p>
 
<b>Gabriel Valle</b> - A plataforma deve fornecer sistema de registro, quantidade total, integração com calendário acadêmico, suporte para envio de comprovantes, geração automática de relatórios, entre outras funcionalidades.
 
<b>Gabriel Caruzo</b> - O objetivo da aplicação é auxiliar no presente processo para cadastro, acompanhamento e validação das AAC realizadas pelos alunos do IBMEC.
 
<b>Professor Coordenador</b> - O principal objetivo da aplicação é a celeridade e automação do processo atual.
 
<b>Equipe de TI</b> - A plataforma deve gerenciar o envio e contabilidade de Atividades Acadêmicas Complementares (AAC)
</p>
 
---
 
### 2. Como será o processo para login de um usuário?
 
<p align = "justify">
<b>Antonni Carvalho</b> - O Aluno deverá fazer login com seu email educacional, já o funcionário deve logar com o email corporativo.
</p>
 
---
 
### 3. Como será a forma de adicionar novas Atividades externas?
 
<p align = "justify">
<b>Antonni Carvalho</b> - O aluno deve enviar comprovantes de participação em atividades que sejam elegíveis para validação/contabilidade como AAC. O sistema deve permitir upload de documentos (certificados, atestados, etc).

<b>Gabriel Caruzo</b> - Os funcionários devem validar a solicitação do aluno, avaliando se o pedido atende aos requisitos estabelecidos pelo IBMEC. Deve haver um workflow de aprovação com prazos definidos.
</p>
 
---

### 4. Como será a forma de adicionar novas Atividades internas?
<p align = "justify">
<b>Antonni Carvalho</b> - O aluno deve ler o QR Code de participação em atividades realizadas pelo CASA para validação/contabilidade como AAC. O código deve ser único por evento.

<b>Gabriel Valle</b> - O sistema deve validar de forma automática ao escanear o QR Code, registrando data, hora e tipo de atividade sem necessidade de intervenção manual.
</p>
 
---

### 5. Como aluno acompanha progresso de horas?

<p align = "justify">
<b>Antonni Carvalho</b> - O sistema deve mostrar o progresso de horas realizadas em tempo real.
 
<b>Gabriel Caruzo</b> - O sistema deve mostrar de forma segregada horas internas e externas, permitindo visualizar o cumprimento dos requisitos por categoria.
 
---
 
### 6. Como seria a forma do aluno adicionar as atividades?
<p align = "justify">
<b>Gabriel Valle</b> - Atividades Internas: via QR Code e preenchimento automático de informações.
Atividades Externas: via upload de comprovação, conforme requisitos do IBMEC (certificados, atestados, cartas de participação).
</p>
 
### 7. Quais informações seriam interessantes para o usuário?
<p align = "justify">
   <b>Antonni Carvalho</b> - Acompanhamento de horas (Total necessário, realizadas, restantes)
   
   <b>Gabriel Valle</b> - Separação entre horas externas e internas (Cursos, Palestras, Workshops, Voluntariado, etc)
   
   <b>Gabriel Caruzo</b> - Histórico de atividades com datas, status de validação e documentos anexados

</p>
 
### Requisitos Elicitados
 
|ID|Descrição|
|----|-------------|
|BS01| O aluno pode fazer login com email educacional|
|BS02| O funcionário pode fazer login com email corporativo|
|BS03| O aluno pode enviar comprovantes de atividades externas|
|BS04| O sistema valida automaticamente atividades internas via QR Code|
|BS05| O funcionário valida manualmente atividades externas|
|BS06| O sistema mostra progresso de horas em tempo real|
|BS07| O sistema segrega horas internas e externas|
|BS08| O sistema gera relatórios automáticos de atividades|
|BS09| O aluno visualiza histórico completo de atividades|
|BS10| O sistema deve notificar aluno sobre status de validação|
|BS11| O funcionário pode filtrar atividades pendentes de validação|
|BS12| O sistema deve controlar prazos de cumprimento de horas|
|BS13| O sistema deve categorizar atividades por tipo (Cursos, Palestras, Voluntariado, etc)|
 
## Conclusão
<p align = "justify">
Através da aplicação da técnica de brainstorm, foi possível elicitar os requisitos principais do projeto de AAC. O sistema busca automatizar o processo interno (atividades internas via QR Code) e melhorar a experiência do aluno (acompanhamento em tempo real), mantendo a validação de atividades externas. Foram identificadas funcionalidades essenciais como autenticação diferenciada, integração com calendário acadêmico, geração de relatórios e acompanhamento segregado de horas.
</p>

## Referências Bibliográficas
 
> BARBOSA, S. D. J; DA SILVA, B. S. Interação humano-computador. Elsevier, 2010.
 
 
## Autor(es)
| Data | Versão | Descrição | Autor(es) |
| -- | -- | -- | -- |
| 05/04/26 | 1.0 | Criação do documento | Antonni Carvalho, Gabriel Caruzo e Gabriel Valle |
| 07/04/26 | 2.0 | Adicionada visão geral | Gabriel Caruzo | 
