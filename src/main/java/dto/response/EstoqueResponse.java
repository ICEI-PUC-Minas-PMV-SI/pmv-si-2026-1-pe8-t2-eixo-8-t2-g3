package dto.response;

import java.time.LocalDateTime;

public record EstoqueResponse(
  Long id,
  Long saborId,
  String saborNome,
  Integer quantidadeMovimentada,
  Integer validadeDias,
  LocalDateTime dataCriacao,
  LocalDateTime dataAtualizacao
) {}
