# Parecer Técnico de Avaliação do App Django REST + React

## Escopo

Este parecer avalia o backend em Django REST Framework consumido pelo frontend React com base em três dimensões:

- especificação
- codificação
- conformidade

A análise foi realizada a partir da documentação funcional disponível em `docs/`, da implementação do backend em `core/` e `config/`, e do consumo da API no frontend em `my-react-app/src/`.

## Síntese Executiva

O projeto apresenta uma base funcional coerente com o problema de negócio proposto, especialmente nos fluxos de login, cadastro de atividades internas por QR Code, envio de atividades externas, dashboard de progresso e administração básica. No entanto, o sistema ainda se encontra em um estágio de protótipo evoluído, não em um estágio de conformidade técnica adequada para produção.

Os principais desvios concentram-se em três frentes:

- ausência de autenticação e autorização robustas
- implementação incompleta das regras de negócio documentadas
- baixa maturidade de qualidade operacional, especialmente em testes, segurança e documentação de API

Em termos práticos, a solução demonstra aderência parcial à visão funcional do produto, mas ainda não atende aos requisitos mínimos esperados para um serviço DRF seguro, auditável e aderente a boas práticas de engenharia.

## Tabela de Pontuação

| Dimensão | Critério | Nota (1-5) | Justificativa |
|---|---|---:|---|
| Especificação | Clareza dos requisitos funcionais e não funcionais | 3 | A documentação em `docs/_Design Thinking/` descreve personas, fluxos e critérios de aceitação principais, mas não define contrato técnico formal de API, requisitos não funcionais mensuráveis, nem regras operacionais completas. |
| Especificação | Aderência de models, serializers, views e endpoints às regras de negócio | 2 | O domínio básico existe, mas várias regras descritas nos documentos não foram implementadas ou foram implementadas parcialmente, como sessão de 30 minutos, filtros de fila, solicitação de ajuste, notificações e limites por categoria. |
| Especificação | Existência e consistência de documentação de API | 1 | Não foi identificada documentação OpenAPI, Swagger ou schema publicado. |
| Codificação | Estrutura DRF e boas práticas arquiteturais | 2 | Há uso de `ModelViewSet` e `DefaultRouter`, porém sem autenticação robusta, permissões por papel, paginação, filtros, throttling ou separação clara de regras de negócio. |
| Codificação | Legibilidade, reutilização e tratamento de exceções | 2 | O código é razoavelmente legível, mas concentra regras de negócio nas views, possui validações dispersas e tratamento de erro básico. |
| Codificação | Validações, otimização de consultas e prevenção de N+1 | 1 | As validações estão majoritariamente no frontend; não há uso de `select_related` ou `prefetch_related`; há risco de N+1 em serialização de relacionamentos. |
| Codificação | Cobertura de testes | 1 | O arquivo `core/tests.py` está vazio, sem testes unitários ou de integração para fluxos críticos. |
| Conformidade | Segurança da aplicação | 1 | Há senhas em texto puro, autenticação improvisada por header, `DEBUG=True`, `SECRET_KEY` hardcoded e CORS excessivamente permissivo. |
| Conformidade | Aderência a padrões REST | 2 | A API usa verbos e códigos HTTP em parte dos fluxos, mas há inconsistências de contrato, side effects em endpoint `GET` e ausência de padronização mais rigorosa. |
| Conformidade | Privacidade e LGPD/GDPR | 1 | Não há evidências de hashing de senha, política de retenção de anexos, trilha de auditoria adequada ou minimização de exposição de dados pessoais. |
| Conformidade | Deploy, ambiente e governança operacional | 2 | O ambiente serve para desenvolvimento, mas não há segregação de settings por ambiente, controle de secrets por variáveis de ambiente ou preparação clara para produção. |

## Não Conformidades e Desvios

### 1. Autenticação e autorização inadequadas

- Todas as viewsets utilizam `AllowAny`, inclusive operações administrativas.
- A identificação do usuário é feita por meio do header `X-Usuario-Matricula`, sem mecanismo real de autenticação.
- Não há uso de sessão autenticada, token JWT, OAuth2 ou autenticação baseada em `django.contrib.auth`.
- O login diferencia aluno e funcionário apenas por dados persistidos, sem enforcement efetivo de autorização por perfil.

Impacto:

- qualquer cliente que conheça uma matrícula pode consultar ou operar fluxos protegidos
- operações de aprovação, rejeição, criação e listagem administrativa ficam expostas

### 2. Senhas armazenadas e validadas em texto puro

- O modelo `Usuario` persiste o campo `senha` como texto simples.
- O endpoint de login compara `usuario.senha == senha` diretamente.
- O endpoint de mudança de senha também opera com senha em texto claro.

Impacto:

- falha grave de segurança
- não conformidade com práticas mínimas de proteção de credenciais
- elevado risco em caso de vazamento de banco ou logs

### 3. Regras de negócio documentadas não implementadas integralmente

Regras previstas na documentação e ausentes ou incompletas na implementação:

- validade de email educacional `@ibmec.edu.br` e corporativo `@ibmec.br`
- manutenção de sessão por 30 minutos de inatividade
- fila paginada com 10 itens por página
- filtros por aluno, tipo e data para validação administrativa no backend
- opção de "Solicitar Ajuste"
- notificações in-app e por email após decisão
- alertas de prazo e risco acadêmico
- categorização detalhada por tipo de atividade no dashboard
- detalhamento expandido de histórico com filtros por status, tipo e período
- validação automática de limites por categoria conforme documentos

Impacto:

- aderência apenas parcial às histórias de usuário
- deslocamento indevido de responsabilidade para o frontend

### 4. Validações insuficientes no backend

- O backend aceita dados críticos sem validação consistente em serializer.
- O upload de arquivo não demonstra validação robusta de extensão, MIME type e tamanho no servidor.
- Não há validação explícita de pertinência entre categoria, tipo e regras acadêmicas.
- Não há regra centralizada para impedir extrapolação de horas por categoria.

Impacto:

- inconsistência de dados
- possibilidade de submissões inválidas ou maliciosas

### 5. Ausência de documentação formal da API

- Não foi localizado schema OpenAPI.
- Não há Swagger UI, Redoc ou documentação técnica de endpoints.
- O contrato da API precisa ser inferido pelo frontend e pelo código-fonte.

Impacto:

- aumenta custo de integração
- reduz governança e capacidade de auditoria

### 6. Fragilidades REST e de desenho de endpoints

- O endpoint `GET /api/usuarios/horas-totais/` atualiza e salva campos no banco, produzindo side effect em operação de leitura.
- O backend expõe tanto rotas padrão de `ModelViewSet` quanto actions customizadas sem convenção uniforme.
- O frontend usa rotas como `/api/solicitacoes/` para fluxo administrativo porque o backend não separa bem escopo de consulta por papel.

Impacto:

- quebra de expectativa REST
- aumento do acoplamento entre frontend e detalhes internos da API

### 7. Falta de recursos essenciais do DRF para produção

- não há paginação configurada
- não há filtering backend
- não há ordering configurado via filtros do DRF
- não há throttling
- não há autenticação global do DRF configurada em `REST_FRAMEWORK`
- não há permissions customizadas por papel

Impacto:

- baixa escalabilidade
- baixa previsibilidade de comportamento
- maior exposição a abuso e scraping

### 8. Ausência de testes automatizados

- `core/tests.py` não cobre login, cadastro, aprovação, rejeição, cálculo de horas ou regras de limite.

Impacto:

- alto risco de regressão
- baixa confiança para refatoração e evolução

### 9. Configuração insegura e pouco aderente a ambiente corporativo

- `DEBUG=True`
- `SECRET_KEY` exposta no código
- `CORS_ALLOW_ALL_ORIGINS = True`
- SQLite como banco padrão sem separação por ambiente
- ausência de leitura estruturada de variáveis de ambiente

Impacto:

- inadequado para produção
- não aderente a controles operacionais mínimos

### 10. Privacidade e proteção de dados insuficientes

- dados pessoais e anexos circulam sem evidências de política de retenção ou proteção adicional
- não há trilha clara de auditoria para decisões de aprovação e rejeição
- não há evidências de anonimização, mascaramento ou política de logs

Impacto:

- risco de não conformidade com LGPD

## Aderência entre Documentação e Implementação

### Pontos de aderência identificados

- Existe fluxo de login consumido pelo React.
- Existe fluxo de atividade interna com QR Code no frontend e criação de solicitação interna aprovada automaticamente no backend.
- Existe fluxo de atividade externa com upload de comprovante e envio para fila.
- Existe dashboard com total, horas internas e externas.
- Existe área administrativa com ações de aprovação, rejeição, cadastro de categoria e cadastro de evento.

### Pontos de divergência relevantes

- O frontend assume parte das validações de negócio que deveriam estar garantidas pelo backend.
- O backend não implementa várias regras descritas nos critérios de aceitação das histórias de usuário.
- O React consome endpoints administrativos sem camada robusta de autorização.
- O contrato de resposta da API é simplificado e em alguns casos insuficiente para a semântica exibida na interface.

## Recomendações Práticas para Melhoria

### Prioridade alta

1. Substituir o modelo atual de autenticação por solução real com `django.contrib.auth`, senhas com hash e autenticação por sessão ou JWT.
2. Implementar permissões por perfil para aluno, avaliador e coordenação, removendo `AllowAny` das operações sensíveis.
3. Mover validações críticas para serializers e regras centrais de domínio.
4. Corrigir o tratamento de segredos e ambiente, removendo `SECRET_KEY` hardcoded, desabilitando `DEBUG` em produção e restringindo CORS.
5. Criar testes automatizados para os fluxos críticos.

### Prioridade média

1. Adicionar paginação, filtros e ordenação backend nas listagens administrativas.
2. Criar documentação OpenAPI com Swagger ou Redoc.
3. Implementar regras de limite por categoria diretamente no backend.
4. Separar lógica de negócio das views em camadas de serviço.
5. Revisar contratos de resposta para enriquecer dados consumidos pelo frontend sem depender de inferências locais.

### Prioridade baixa

1. Adicionar trilha de auditoria para decisões administrativas.
2. Implementar notificações in-app e por email.
3. Criar indicadores operacionais e relatórios para coordenação.
4. Refinar conformidade LGPD com política de retenção de anexos e mascaramento de dados quando aplicável.

## Conclusão

Sob a ótica de especificação, codificação e conformidade, o sistema demonstra boa intenção arquitetural e aderência parcial aos fluxos de produto definidos nos documentos. Contudo, o backend DRF ainda não atende ao nível de maturidade esperado para um serviço corporativo confiável.

O maior problema não está na ausência de telas ou fluxos básicos, mas na fragilidade estrutural da API: autenticação improvisada, validações insuficientes, ausência de testes, segurança fraca e baixa formalização de contrato técnico.

Assim, a avaliação final é a seguinte:

- adequado como protótipo funcional acadêmico
- parcialmente aderente à especificação funcional
- não conforme para produção do ponto de vista de segurança, governança e engenharia de API

## Referências Avaliadas

- `docs/_Design Thinking/historiasdeusuario.md`
- `docs/_Design Thinking/analise_de_tarefas.md`
- `docs/_Design Thinking/5w2h.md`
- `docs/_Design Thinking/pesquisa.md`
- `docs/_Design Thinking/mapa_mental.md`
- `docs/_Design Thinking/prototipo_baixa_fidelidade.md`
- `core/models.py`
- `core/serilizers.py`
- `core/views.py`
- `core/urls.py`
- `core/tests.py`
- `config/settings.py`
- `config/urls.py`
- `my-react-app/src/jsx/Login.jsx`
- `my-react-app/src/jsx/Perfil.jsx`
- `my-react-app/src/jsx/FormInterno.jsx`
- `my-react-app/src/jsx/FormExterno.jsx`
- `my-react-app/src/jsx/DashboardGeral.jsx`
- `my-react-app/src/jsx/AdminDashboard.jsx`