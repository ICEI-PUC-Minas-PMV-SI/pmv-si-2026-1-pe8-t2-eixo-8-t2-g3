package dto.request;

public record EstoqueRequest(
  Long saborId,
  Integer quantidadeMovimentada,
  Integer validadeDias
){}