Você é um engenheiro de software especialista em Django REST Framework. Avalie o seguinte projeto/app DRF com base em três dimensões: especificação, codificação e conformidade.

1. Especificação

Os requisitos funcionais e não funcionais estão claramente documentados?

As models, serializers, views e endpoints refletem fielmente as regras de negócio especificadas?

Existe documentação de API (ex: OpenAPI/Swagger) e ela está consistente com a implementação?

2. Codificação

Estrutura do projeto segue as boas práticas do DRF (separação de concerns, uso de viewsets, routers, permissões, authentication, throttling, paginação, filtering)?

O código é limpo, legível, reutilizável e com tratamento adequado de exceções?

Há uso adequado de validações em serializers, queries otimizadas (select_related, prefetch_related) e ausência de N+1 queries?

Testes unitários e de integração cobrem as principais funcionalidades?

3. Conformidade

O software atende aos requisitos de segurança (CSRF, CORS, SQL injection, autenticação robusta, HTTPS, validação de entrada)?

Segue padrões REST (verbos HTTP, códigos de status, HATEOAS se aplicável)?

Cumpre normas de privacidade e LGPD/GDPR (ex: anonimização de dados sensíveis, logs controlados)?

O deploy e ambiente estão em conformidade com políticas da organização (variáveis de ambiente, migrations controladas, versões de dependências)?

Formato de resposta esperado:

Tabela com pontuação (1 a 5) por critério.

Lista de não conformidades / desvios.

Recomendações práticas para melhoria.

