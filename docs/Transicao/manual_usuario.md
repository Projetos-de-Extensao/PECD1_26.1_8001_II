# Manual do Usuario

Este manual mostra como usar o Portal AAC pelo navegador.

## Acessar o Sistema

1. Abra o frontend:

   ```text
   http://localhost:5173/
   ```

2. O sistema redireciona para a tela de login.
3. Informe email e senha.
4. Clique em **Entrar**.

Alunos acessam a area comum do portal. Funcionarios acessam tambem o painel administrativo.

## Criar Conta de Aluno

1. Na tela de login, clique em **Cadastre-se**.
2. Preencha os dados do aluno.
3. Use email institucional terminado em `@ibmec.edu.br`.
4. Informe a senha.
5. Envie o cadastro.

O cadastro de aluno sempre cria o usuario com perfil de aluno, ou seja, sem permissao administrativa.

## Recuperar Senha Antes do Login

1. Na tela de login, clique em **Esqueci minha senha**.
2. Informe email, matricula e nova senha.
3. Confirme a nova senha.
4. Envie o formulario.
5. Volte ao login e entre com a nova senha.

A nova senha precisa ter pelo menos 8 caracteres.

## Consultar Dashboard

1. Depois do login, acesse **Home**.
2. Veja o total de horas computadas.
3. Consulte horas internas e externas.
4. Acompanhe o progresso em relacao a meta do curso.
5. Consulte os eventos disponiveis no mural.

## Registrar Atividade Interna

1. Acesse **Solicitacoes**.
2. Escolha a area de atividade interna.
3. Informe ou leia o codigo do evento.
4. Envie o registro.

Quando o evento existe e esta ativo, a atividade interna e registrada como aprovada automaticamente. O sistema impede registrar o mesmo evento mais de uma vez para o mesmo aluno.

## Enviar Atividade Externa

1. Acesse **Solicitacoes**.
2. Escolha a area de atividade externa.
3. Preencha categoria, data, horas e nome da atividade.
4. Anexe o comprovante.
5. Envie a solicitacao.

Formatos aceitos para comprovante:

- PDF
- PNG
- JPG
- JPEG

O arquivo deve ter no maximo 5 MB. A atividade externa fica com status `Pendente` ate a analise administrativa.

## Consultar Historico

1. Acesse **Solicitacoes**.
2. Veja a lista de atividades enviadas.
3. Use os filtros disponiveis para consultar por status ou tipo.
4. Confira se a solicitacao esta pendente, aprovada, rejeitada ou com ajuste solicitado.

## Alterar Senha Logado

1. Acesse **Perfil**.
2. Abra a opcao de alteracao de senha.
3. Informe a senha atual.
4. Informe a nova senha.
5. Confirme a alteracao.

## Usar o Painel Administrativo

O painel administrativo fica em:

```text
/admin
```

Somente usuarios funcionarios conseguem acessar.

No painel, o funcionario pode:

- visualizar base de alunos;
- consultar fila de validacao;
- filtrar solicitacoes por aluno, tipo, status e data;
- aprovar solicitacoes;
- rejeitar solicitacoes com motivo;
- solicitar ajuste;
- criar categorias;
- criar eventos;
- cadastrar funcionarios.

## Sair do Sistema

1. Abra o menu de navegacao.
2. Clique em **Sair**.
3. O sistema remove os dados salvos no navegador e volta para o login.

## Problemas Comuns

| Situacao | Como resolver |
| --- | --- |
| Frontend abre, mas nao carrega dados | Verifique se o backend esta rodando em `http://127.0.0.1:8000/` |
| Login retorna erro | Confira email, senha e se o usuario esta ativo |
| Aluno nao acessa admin | Esse comportamento esta correto; apenas funcionarios acessam |
| Upload nao envia | Confira formato e tamanho do arquivo |
| Sessao expirada | Faca login novamente |
