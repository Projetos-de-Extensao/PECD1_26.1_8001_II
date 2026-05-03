---
id: prototipo
title: Protótipo de Baixa Fidelidade
---

## Introdução

<<<<<<< HEAD
<p align = "justify">
A criação de um protótipo de alta fidelidade ajuda a equipe de desenvolvimento a alcançar um nível de detalhamento mais completo, identificar funcionalidades, avaliar a usabilidade e também serve como base para o gerenciamento do projeto, pois com esse protótipo é possível estimar quanto tempo será necessário para executar cada funcionalidade.

=======
<p align="justify">
O protótipo de baixa fidelidade auxilia a equipe a visualizar o fluxo básico da aplicação AAC sistema. Este protótipo apresenta as 8 principais telas do sistema com autenticação, perfil e os fluxos distintos para atividades internas e externas.
>>>>>>> 318eb3913bb7114018aaa06c88b4a4633b0fe522
</p>

## Metodologia

<p align="justify">
Após análise do Brainstorm e AHT, foram identificadas as 8 telas principais do sistema. O protótipo foi desenvolvido com PlantUML Salt para manter clareza e simplicidade na comunicação entre membros da equipe.
</p>

## Protótipo de Baixa Fidelidade - Versão 1.0

### Tela 1: Login
```plantuml
@startsalt
{+
<b>AAC sistema
BEM-VINDO
==
Email Educacional:
"                        "
Senha:
"******** "
[Entrar]
[Esqueceu a senha?]
}
@endsalt
```

### Tela 2: Perfil do Aluno
```plantuml
@startsalt
{+
<b>AAC sistema - Perfil do Aluno
==
{^"Dados Pessoais"
👤 João Silva
RA: 20211234567
Curso: Engenharia
Período: 6º
Email: joao@i...
}
{^"Meta de AAC"
Total: 120 horas
Concluído: 80h
Faltando: 40h
Status: ✓ No prazo
}
{^"Últimas Atividades"
* Palestra CASA
* Curso Udemy
* Monitoria
}
[Editar] | [Sair]
}
@endsalt
```

### Tela 3: Seleção de Tipo de Atividade
```plantuml
@startsalt
{+
<b>AAC sistema - Registrar Atividade
==
Escolha o tipo:
() Atividade Interna
() Atividade Externa
==
[Voltar]
}
@endsalt
```

### Tela 4: Fluxo Interno - Escanear QR Code
```plantuml
@startsalt
{+
<b>AAC sistema - Atividade Interna
==
{^"Escanear QR Code"
[  📱 Câmera Ativa  ]
Aproxime o QR Code da tela
}
[Cancelar]
}
@endsalt
```

### Tela 5: Fluxo Interno - Confirmação
```plantuml
@startsalt
{+
<b>AAC sistema - Confirmação Interna
==
{^"Dados Extraídos"
Evento: CASA
Tipo: Palestras
Data: 05/04/2026
Hora: 14:30
Carga: 2 horas
Eixo: Extensão
}
[Confirmar] | [Cancelar]
}
@endsalt
```

### Tela 6: Fluxo Externo - Upload Comprovante
```plantuml
@startsalt
{+
<b>AAC sistema - Atividade Externa
==
Tipo: | ^Curso^
Entidade Emissora: | "Udemy                  "
Carga Horária (h): | "20   "
Data da Atividade: | "01/04/2026"
{^"Comprovante"
[Selecionar Arquivo]
📎 certificado.pdf (2.3 MB)
}
[Enviar] | [Cancelar]
}
@endsalt
```

### Tela 7: Fluxo Externo - Comprovante de Envio
```plantuml
@startsalt
{+
<b>AAC sistema - Enviado com Sucesso
==
{^"Status"
✓ Atividade Enviada
ID: #AAC-2026-001547
Data: 07/04/2026 15:45
}
{^"Detalhes"
Tipo: Curso
Entidade: Udemy
Carga: 20 horas
Arquivo: certificado
}
{^"Validação"
⏳ Aguardando análise
(até 5 dias úteis)
}
[Novo] | [Voltar]
}
@endsalt
```

### Tela 8: Dashboard de Horas
```plantuml
@startsalt
{+
<b>AAC sistema - Seu Progresso
==
{^"Total de Horas"
80 / 120 horas
████████░░ 67%
}
{^"Horas Internas (QR Code)"
50h / 60h
████████░ 83%
}
{^"Horas Externas (Comprovantes)"
30h / 60h
██████░░░ 50%
}
[Ver Histórico]
}
@endsalt
```

<p align="justify">
Na primeira versão do protótipo utilizamos a ferramenta <a href="https://m2.material.io/design/color/the-color-system.html#color-theme-creation">Material Design Color Tool</a> para auxiliar na criação da paleta de cores do aplicativo. Definimos as cores base, mas as cores definidas para algumas telas específicas ainda não foram decididas.
</p>

## Versão 2.0


## Conclusão

<p align="justify">
A partir da elaboração do protótipo foi possível ter uma noção inicial da interface do usuário, definindo fluxo, paleta de cores, botões, app bars e diversas outras funcionalidades.
</p>

## Referências

> Material Design Color Tool. Disponível em: https://m2.material.io/design/color/the-color-system.html#color-theme-creation

> PMI. Um guia do conhecimento em gerenciamento de projetos. Guia PMBOK® 5a. ed. EUA: Project Management Institute, 2013.

> Figma. Disponível em: https://www.figma.com

## Autor(es)

| Data     | Versão | Descrição                            | Autor(es)                                                                            |
| -------- | ------- | -------------------------------------- | ------------------------------------------------------------------------------------ |
| 07/04/26 | 1.0     | Criação do documento                 | Gabriel Caruzo                                                                       |
