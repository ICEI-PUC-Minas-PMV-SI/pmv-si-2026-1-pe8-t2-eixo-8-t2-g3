# Levantamento de Requisitos da Aplicação
## Requisitos Funcionais
| ID    | Requisito funcional                                                                                                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| RF001 | O sistema deve disponibilizar uma aplicação web única com backend Quarkus e frontend React integrados no mesmo produto.                                                                    |
| RF002 | O sistema deve disponibilizar um dashboard inicial com atalhos para os módulos de Clientes, Pedidos, Sabores, Estoque e Status, além de indicadores consolidados do negócio.               |
| RF003 | O sistema deve permitir navegação entre os módulos por rotas no frontend, sem recarregamento completo da página.                                                                           |
| RF004 | O sistema deve permitir gerenciar clientes, incluindo cadastro, consulta, edição e alteração de status ativo/inativo.                                                                      |
| RF005 | O sistema deve permitir gerenciar pedidos, incluindo cadastro, consulta, edição e mudança de status.                                                                                       |
| RF006 | Ao criar um pedido, o sistema deve defini-lo automaticamente como Pendente e validar cliente ativo, sabor ativo e quantidade maior que zero.                                               |
| RF007 | O sistema deve permitir cancelar pedidos sem exclusão física, alterando seu status para Cancelado.                                                                                         |
| RF008 | O sistema deve permitir finalizar pedidos, alterando seu status para Finalizado e realizando a respectiva baixa de estoque.                                                                |
| RF009 | O sistema deve permitir gerenciar sabores, incluindo cadastro, consulta, edição e alteração de status ativo/inativo.                                                                       |
| RF010 | O sistema deve permitir gerenciar o estoque, incluindo visualização consolidada e registro de movimentações por sabor.                                                                     |
| RF011 | O sistema deve validar que a movimentação de estoque esteja vinculada a um sabor existente e possua quantidade maior que zero, registrando automaticamente datas de criação e atualização. |
| RF012 | O sistema deve permitir gerenciar status, incluindo cadastro, consulta, edição e alteração de status ativo/inativo.                                                                        |
| RF013 | Todas as listagens dos módulos devem ser exibidas em tabela com filtragem, ordenação e paginação.                                                                                          |
| RF014 | Cada módulo deve possuir formulários de cadastro e edição compatíveis com seus DTOs de entrada.                                                                                            |
| RF015 | O frontend deve consumir os endpoints REST já definidos para os cinco módulos da aplicação.                                                                                                |
| RF016 | O frontend deve exibir feedback visual de carregamento, sucesso e erro nas operações, sem uso de notificações do tipo toast.                                                               |
| RF017 | O sistema não deve exigir autenticação para acesso às funcionalidades.                                                                                                                     |
| RF018 | O sistema não deve realizar exclusão física nos fluxos principais, priorizando cancelamento ou alternância de status.                                                                      |
| RF019 | O sistema deve manter separação entre DTOs de entrada e saída e tratar adequadamente os códigos HTTP nas integrações entre frontend e backend.                                             |
| RF020 | O sistema deve disponibilizar os endpoints REST existentes como base funcional da aplicação completa.                                                                                      |
| RF021 | O sistema poderá possuir empacotamento alternativo em desktop via Electron, reutilizando a base da aplicação web.                                                                          |
## Requisitos Não Funcionaiss
| ID     | Requisito não funcional                                                                                                                                           |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF001 | O backend deve ser desenvolvido em Java com Quarkus, seguindo padrão REST com Jakarta, Hibernate Panache ORM, SQLite e build com Maven. |
| RNF002 | O frontend deve ser desenvolvido em React, utilizando Mantine, React Router, Axios e Vite.                                                                        |
| RNF003 | O build final do frontend deve ser empacotado e servido pelo Quarkus a partir de META-INF/resources.                                                              |
| RNF004 | A solução deve ser entregue como aplicação web responsiva.                                                           |
| RNF005 | A interface deve seguir a identidade visual da marca, manter consistência entre telas e não implementar tema claro/escuro nesta versão.                           |
| RNF006 | O backend deve manter arquitetura em camadas, com separação entre controller, service, DTO, model e repository.                                                   |
| RNF007 | As regras de negócio devem permanecer centralizadas na camada de service, com separação de responsabilidades, uso de injeção de dependência e serviços stateless. |
| RNF008 | O sistema deve possuir validação de entrada no frontend e no backend e manter padrão consistente de respostas HTTP.                                               |
| RNF009 | O código deve compilar sem erros e estar apto para testes e deploy.                                                                                               |
| RNF010 | A solução deve estar preparada para crescimento, com suporte a paginação, filtros, ordenação e documentação suficiente para manutenção futura.                    |
| RNF011 | A aplicação deve ser adequada para distribuição como webapp integrado.                                                                                            |
| RNF012 | Em versão alternativa desktop, a aplicação poderá ser empacotada com Electron, preservando a mesma base funcional da solução web.                                 |