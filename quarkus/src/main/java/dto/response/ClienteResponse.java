package dto.response;

public record ClienteResponse(
  Long id,
  String nome,
  String telefone,
  Boolean ativo
) {}