---
id: prototipo
title: Prototipo de Baixa Fidelidade
---

# Prototipo de Baixa Fidelidade

## Introducao

O prototipo de baixa fidelidade apresenta a estrutura atual do Portal AAC depois da implementacao realizada no projeto. O objetivo e representar as telas principais de forma simples, sem detalhamento visual de alta fidelidade, para documentar fluxo, hierarquia de informacao e acoes esperadas.

Esta versao acompanha o que existe hoje na aplicacao React e na API Django REST:

- login com mensagem de erro;
- cadastro publico de aluno;
- recuperacao de senha antes do login;
- dashboard do aluno;
- solicitacoes internas e externas;
- historico de atividades;
- perfil e troca de senha;
- painel administrativo para funcionarios;
- documentacao da API com Swagger/Redoc.

## Metodologia

Os prototipos foram atualizados a partir das rotas e componentes implementados no frontend:

- `/login`
- `/cadastro`
- `/home`
- `/solicitacoes`
- `/perfil`
- `/admin`

Tambem foram considerados os principais endpoints do backend, como login, cadastro, recuperacao de senha, criacao de solicitacoes, validacao administrativa, categorias, eventos e schema OpenAPI.

Os desenhos abaixo seguem o estilo de baixa fidelidade usando PlantUML Salt, com foco em blocos, campos, botoes e fluxo.

## Versao 2.0 - Prototipo Atualizado

### Tela 1: Login

```plantuml
@startsalt
{+
<b>Portal AAC - Login
==
[ IBMEC ]

Entrar
Acesse o portal AAC

E-mail de acesso:
" aluno@ibmec.edu.br ou prof@ibmec.br "

Senha:
" ******** " [Mostrar]

{^"Mensagem de erro"
E-mail ou senha incorretos.
}

[ ] Lembrar de mim      [Esqueci minha senha]

[ Entrar ]

Nao tem uma conta? [Cadastre-se]
}
@endsalt
```

### Tela 2: Recuperar Senha Antes do Login

```plantuml
@startsalt
{+
<b>Redefinir senha
==
E-mail de acesso:
" aluno@ibmec.edu.br "

Matricula:
" 20260001 "

Nova senha:
" ******** "

Confirmar nova senha:
" ******** "

{^"Validacoes"
* todos os campos obrigatorios
* senha minima de 8 caracteres
* email + matricula devem conferir
}

[Cancelar] [Salvar nova senha]
}
@endsalt
```

### Tela 3: Cadastro de Aluno

```plantuml
@startsalt
{+
<b>Cadastro de Aluno
==
Nome completo:
" Gabriel Caruzo "

Matricula:
" 20260001 "

E-mail institucional:
" aluno@ibmec.edu.br "

Curso:
" Engenharia / Direito / Outros "

Ano de entrada:
" 2026 "

Periodo:
" 2o Periodo "

Senha:
" ******** "

{^"Regra"
is_funcionario = false
}

[Criar conta] [Voltar ao login]
}
@endsalt
```

### Tela 4: Home / Dashboard do Aluno

```plantuml
@startsalt
{+
<b>Portal AAC - Home
==
{^"Resumo de Horas"
Total: 80 / 120h
Internas: 50 / 60h
Externas: 30 / 60h
}

{^"Progresso"
[########--] 67%
}

{^"Mural de Eventos"
* Palestra de Extensao - 2h
* Workshop de Carreira - 3h
* Evento Institucional - 4h
}

[Ver solicitacoes] [Perfil]
}
@endsalt
```

### Tela 5: Solicitacoes - Escolha do Fluxo

```plantuml
@startsalt
{+
<b>Solicitacoes AAC
==
{^"Atividade Interna"
Registrar presenca em evento institucional.
[Abrir fluxo interno]
}

{^"Atividade Externa"
Enviar comprovante de curso, palestra, voluntariado etc.
[Abrir formulario externo]
}

{^"Historico"
Status | Tipo | Data | Horas
Pendente | Externa | 10/06 | 20h
Aprovada | Interna | 11/06 | 2h
}
}
@endsalt
```

### Tela 6: Atividade Interna

```plantuml
@startsalt
{+
<b>Registrar Atividade Interna
==
{^"Codigo do Evento"
" EVT-2026-001 "
[Buscar evento]
}

{^"Dados do Evento"
Nome: Workshop de Carreira
Data: 14/06/2026
Horas: 3h
Categoria: Evento Institucional
}

{^"Regra"
Se o evento existir e estiver ativo,
a atividade entra como Aprovada.
}

[Confirmar presenca] [Cancelar]
}
@endsalt
```

### Tela 7: Atividade Externa

```plantuml
@startsalt
{+
<b>Enviar Atividade Externa
==
Categoria:
^ Curso / Palestra / Monitoria ^

Nome da atividade:
" Curso de Python "

Data:
" 14/06/2026 "

Horas:
" 20 "

Comprovante:
[Selecionar arquivo]
certificado.pdf

{^"Validacoes"
PDF, PNG, JPG ou JPEG
Limite: 5 MB
Status inicial: Pendente
}

[Enviar solicitacao] [Limpar]
}
@endsalt
```

### Tela 8: Historico de Solicitacoes

```plantuml
@startsalt
{+
<b>Historico de Atividades
==
Filtro status:
^ Todos / Pendente / Aprovada / Rejeitada / Ajuste ^

Filtro tipo:
^ Todos / Interna / Externa ^

{^"Lista"
Nome | Tipo | Horas | Status
Workshop | Interna | 3h | Aprovada
Curso Python | Externa | 20h | Pendente
Voluntariado | Externa | 10h | Ajuste solicitado
}

[Atualizar]
}
@endsalt
```

### Tela 9: Perfil do Usuario

```plantuml
@startsalt
{+
<b>Perfil
==
{^"Meus Dados"
Nome completo
Matricula
E-mail
Curso
Ano de entrada
Periodo
}

{^"Trocar Senha"
Senha atual:
" ******** "
Nova senha:
" ******** "
[Salvar nova senha]
}

[Sair]
}
@endsalt
```

### Tela 10: Painel Administrativo

```plantuml
@startsalt
{+
<b>Painel Administrativo
==
[Base de Alunos] [Fila de Validacao] [Categorias] [Eventos] [Funcionarios]

{^"Filtros da Fila"
Aluno: " nome ou matricula "
Tipo: ^Todos / Interna / Externa^
Status: ^Pendente / Aprovada / Rejeitada / Ajuste^
Data inicio: " __/__/____ "
Data fim: " __/__/____ "
}

{^"Solicitacao selecionada"
Aluno: Gabriel
Atividade: Curso Python
Horas: 20h
Comprovante: certificado.pdf
}

[Aprovar] [Rejeitar] [Solicitar ajuste]
}
@endsalt
```

### Tela 11: Administracao de Categorias e Eventos

```plantuml
@startsalt
{+
<b>Administracao
==
{^"Criar Categoria"
Atividade: " Palestra "
Categoria: " Eventos "
Tipo: ^Interna / Externa^
Limite de horas: " 60 "
[Salvar categoria]
}

{^"Criar Evento"
Nome: " Workshop "
Categoria: ^Evento Institucional^
Data: " 14/06/2026 "
Hora: " 19:00 "
Horas: " 3 "
[Salvar evento]
}
}
@endsalt
```

### Tela 12: Documentacao da API

```plantuml
@startsalt
{+
<b>Documentacao Tecnica
==
Rotas disponiveis:

[ /api/schema/ ]  Schema OpenAPI
[ /api/docs/   ]  Swagger UI
[ /api/redoc/  ]  Redoc

{^"Uso"
Visualizar endpoints
Testar contratos da API
Apoiar integracao frontend/backend
}
}
@endsalt
```

## Fluxo Geral Atual

```plantuml
@startsalt
{+
Login
  |
  +-- Cadastro de aluno
  |
  +-- Recuperar senha
  |
  +-- Aluno autenticado
  |      |
  |      +-- Home / Dashboard
  |      +-- Solicitacoes
  |      |      +-- Atividade interna
  |      |      +-- Atividade externa
  |      |      +-- Historico
  |      +-- Perfil
  |
  +-- Funcionario autenticado
         |
         +-- Painel administrativo
         +-- Validar solicitacoes
         +-- Gerenciar categorias
         +-- Gerenciar eventos
         +-- Cadastrar funcionarios
}
@endsalt
```

## Conclusao

O prototipo atualizado representa a aplicacao implementada atualmente. A nova versao deixa explicito que o sistema possui duas jornadas principais: a jornada do aluno, focada no envio e acompanhamento de atividades, e a jornada do funcionario, focada na validacao e administracao do processo.

## Autor(es)

| Data | Versao | Descricao | Autor(es) |
| --- | --- | --- | --- |
| 07/04/26 | 1.0 | Criacao do documento inicial | Gabriel Caruzo |
| 14/06/26 | 2.0 | Atualizacao conforme implementacao atual do Portal AAC | Gabriel Caruzo |
