package dto.response;

import java.time.LocalDate;

public record PedidoResponse(
  Long id,
  Long clienteId,
  String clienteNome,
  Long saborId,
  String saborNome,
  Integer quantidade,
  LocalDate dataPedido,
  String statusNome,
  Double valorUnitario
) {}
