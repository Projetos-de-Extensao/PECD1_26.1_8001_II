# Documentacao da Implementacao

Esta pagina registra a implementacao atual do Portal AAC para manter a documentacao em conformidade com o codigo.

## Visao Geral

O sistema possui duas partes principais:

- **Backend:** Django REST Framework, localizado nas pastas `config/` e `core/`.
- **Frontend:** React/Vite, localizado em `my-react-app/`.

O frontend consome a API do backend usando a base definida em `my-react-app/src/api.js`. Em ambiente local, a API usa o mesmo host da tela e a porta `8000`.

## Rotas do Frontend

| Rota | Acesso | Finalidade |
| --- | --- | --- |
| `/login` | Publico | Login de aluno ou funcionario |
| `/cadastro` | Publico | Cadastro de aluno |
| `/home` | Usuario autenticado | Dashboard de horas e mural |
| `/solicitacoes` | Usuario autenticado | Envio e consulta de atividades |
| `/perfil` | Usuario autenticado | Dados do usuario e alteracao de senha |
| `/admin` | Funcionario | Painel administrativo |

As rotas privadas verificam se existem `usuario` e `token` no `localStorage`. A rota administrativa tambem verifica `is_funcionario`.

## Autenticacao e Permissoes

O login e feito em:

```text
POST /api/usuarios/login/
```

Em caso de sucesso, o backend retorna:

- `token`
- `token_type`
- `expires_in`
- dados do `usuario`

As chamadas autenticadas usam:

```text
Authorization: Bearer <token>
```

Permissoes principais:

- Login, cadastro de aluno e recuperacao de senha sao publicos.
- Dados pessoais, solicitacoes e mudanca de senha exigem autenticacao.
- Listagem administrativa, criacao de funcionario, categorias, eventos e validacao exigem usuario funcionario.

## Principais Endpoints

### Usuarios

| Endpoint | Metodo | Finalidade |
| --- | --- | --- |
| `/api/usuarios/login/` | POST | Autenticar usuario |
| `/api/usuarios/criar/` | POST | Cadastrar aluno |
| `/api/usuarios/recuperar-senha/` | POST | Redefinir senha antes do login |
| `/api/usuarios/meus-dados/` | GET | Consultar dados do usuario logado |
| `/api/usuarios/mudar-senha/` | POST | Alterar senha logado |
| `/api/usuarios/horas-totais/` | GET | Consultar progresso de horas |
| `/api/usuarios/lista/` | GET | Listar usuarios para administracao |

### Solicitacoes

| Endpoint | Metodo | Finalidade |
| --- | --- | --- |
| `/api/solicitacoes/criar-externa/` | POST | Enviar atividade externa com comprovante |
| `/api/solicitacoes/criar-interna/` | POST | Registrar atividade interna por evento |
| `/api/solicitacoes/lista/` | GET | Listar solicitacoes do aluno logado |
| `/api/solicitacoes/admin/` | GET | Listar solicitacoes para administracao |
| `/api/solicitacoes/aprovar/` | POST | Aprovar solicitacao |
| `/api/solicitacoes/rejeitar/` | POST | Rejeitar solicitacao |
| `/api/solicitacoes/solicitar-ajuste/` | POST | Solicitar ajuste na solicitacao |

### Categorias e Eventos

| Endpoint | Metodo | Finalidade |
| --- | --- | --- |
| `/api/categorias/lista/` | GET | Listar categorias ativas |
| `/api/categorias/criar/` | POST | Criar categoria |
| `/api/eventos/lista/` | GET | Listar eventos ativos |
| `/api/eventos/criar/` | POST | Criar evento |

## Regras Implementadas

- Senhas sao armazenadas com hash usando `make_password`.
- Login valida senha com `check_password`.
- Tokens expiram em 30 minutos.
- Alunos usam email `@ibmec.edu.br`.
- Funcionarios usam email `@ibmec.br`.
- Cadastro publico cria usuario com `is_funcionario = false`.
- Atividades externas entram como `Pendente`.
- Atividades internas por evento entram como `Aprovada`.
- Sistema impede registrar presenca duplicada no mesmo evento.
- Upload de comprovante valida extensao, MIME type e limite de 5 MB.
- Limite de horas por categoria e validado no backend.
- Painel administrativo permite aprovar, rejeitar e solicitar ajuste.
- Listagens administrativas usam filtros por aluno, tipo, status e data.

## Execucao Local

Backend:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:

```powershell
cd my-react-app
npm install
npm run dev
```

## Itens Ainda Pendentes

- Adicionar Swagger UI ou Redoc para visualizar o schema OpenAPI em tela.
- Separar papeis administrativos alem de `is_funcionario`.
- Implementar notificacoes in-app e por email.
- Criar regras formais de retencao de arquivos enviados.
- Revisar migrations para garantir que todos os campos atuais estejam versionados.
- Ampliar cobertura de testes para filtros, limites e fluxos administrativos.
