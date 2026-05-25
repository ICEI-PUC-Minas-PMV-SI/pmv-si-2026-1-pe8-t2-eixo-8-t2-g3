package service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import persistence.model.EstoqueProdutos;
import persistence.model.Pedido;
import persistence.repository.ClienteRepository;
import persistence.repository.EstoqueProdutosRepository;
import persistence.repository.PedidoRepository;

@ApplicationScoped
public class AnalyticsService {

  @Inject
  ClienteRepository clienteRepository;

  @Inject
  PedidoRepository pedidoRepository;

  @Inject
  EstoqueProdutosRepository estoqueRepository;

  public Long recuperarQuantidadeClientes() {
    return clienteRepository.count("indicadorAtivo", true);
  }

  public Map<String, Double> recuperarValorTotalVendasPorMes() {
    List<Pedido> pedidos = pedidoRepository.listAll();
    return pedidos.stream()
      .filter(p -> p.getStatus().getNome().equals("Finalizado"))
      .collect(Collectors.groupingBy(
        p -> p.getDataPedido().toString().substring(0, 7),
        Collectors.summingDouble(p -> p.getQuantidade() * p.getValorUnitario())
      ));
  }

  public Long recuperarQuantidadeProdutos() {
    List<EstoqueProdutos> estoques = estoqueRepository.listAll();
    return estoques.stream()
      .mapToLong(EstoqueProdutos::getQuantidadeMovimentada)
      .sum();
  }
}
