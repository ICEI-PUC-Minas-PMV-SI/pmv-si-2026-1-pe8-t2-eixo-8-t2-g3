package dto.request;

public record PedidoRequest(
  Long clienteId,
  Long saborId,
  Integer quantidade,
  Double valorUnitario
){}
