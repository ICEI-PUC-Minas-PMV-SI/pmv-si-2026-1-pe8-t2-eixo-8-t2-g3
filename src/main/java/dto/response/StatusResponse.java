package dto.response;

public record StatusResponse(
  Long id,
  String nome,
  Boolean ativo
) {}
