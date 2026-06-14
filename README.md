# Portal AAC - Django REST + React

Projeto de controle de Atividades Academicas Complementares (AAC), com backend em Django REST Framework e frontend em React/Vite.

## Integrantes

- Gabriel Valle
- Guilherme
- Antonni
- Gabriel
- Artur
- Bernardo

## Tecnologias

- Python 3.12
- Django
- Django REST Framework
- React
- Vite
- SQLite

## Pre-requisitos

Antes de instalar, verifique se voce tem:

- Python 3.12 ou superior
- Node.js 20 ou superior
- Git
- PowerShell ou terminal equivalente

## Instalacao do Backend

Entre na pasta do projeto:

```powershell
cd PECD1_26.1_8001_II
```

Crie a virtualenv dentro da pasta do projeto:

```powershell
python -m venv .venv
```

Ative a virtualenv:

```powershell
.\.venv\Scripts\Activate.ps1
```

Instale as dependencias:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Rode as migrations:

```powershell
python manage.py migrate
```

Inicie o servidor Django:

```powershell
python manage.py runserver
```

O backend ficara disponivel em:

```text
http://127.0.0.1:8000/
```

Schema da API:

```text
http://127.0.0.1:8000/api/schema/
```

## Instalacao do Frontend

Em outro terminal, entre na pasta do React:

```powershell
cd PECD1_26.1_8001_II\my-react-app
```

Instale as dependencias:

```powershell
npm install
```

Inicie o servidor Vite:

```powershell
npm run dev
```

O frontend ficara disponivel em:

```text
http://localhost:5173/
```

## Como Usar

1. Rode o backend Django em `http://127.0.0.1:8000/`.
2. Rode o frontend React em `http://localhost:5173/`.
3. Acesse a tela de login pelo navegador.
4. Use o portal para cadastrar alunos, registrar atividades, enviar comprovantes e validar solicitacoes na area administrativa.

## Comandos Uteis

Rodar testes do backend:

```powershell
python manage.py test
```

Rodar lint do frontend:

```powershell
cd my-react-app
npm run lint
```

Gerar build do frontend:

```powershell
cd my-react-app
npm run build
```

## Observacoes

- A virtualenv deve ficar dentro da pasta do projeto com o nome `.venv`.
- Sempre use `python -m pip` dentro da virtualenv para evitar instalar pacotes no ambiente errado.
- O backend precisa estar rodando para o frontend conseguir consumir a API.
- O banco padrao do projeto e SQLite, usando o arquivo `db.sqlite3`.
