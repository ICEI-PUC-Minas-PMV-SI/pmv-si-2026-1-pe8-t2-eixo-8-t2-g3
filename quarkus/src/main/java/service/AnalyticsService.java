package service;

import java.util.List;
import java.util.stream.Collectors;

import dto.response.analytics.TotalClientesAtivosResponse;
import dto.response.analytics.TotalProdutosEstoqueResponse;
import dto.response.analytics.VendasPorMes;
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

  public TotalClientesAtivosResponse recuperarQuantidadeClientes() {
    Long total = clienteRepository.count("indicadorAtivo", true);
    return new TotalClientesAtivosResponse(total);
  }

  public List<VendasPorMes> recuperarValorTotalVendasPorMes() {
    List<Pedido> pedidos = pedidoRepository.listAll();
    return pedidos.stream()
      .filter(p -> p.getStatus().getNome().equals("Finalizado"))
      .collect(Collectors.groupingBy(
        p -> p.getDataPedido().toString().substring(0, 7),
        Collectors.summingDouble(p -> p.getQuantidade() * p.getValorUnitario())
      ))
      .entrySet()
      .stream()
      .map(e -> new VendasPorMes(e.getKey(), e.getValue()))
      .collect(Collectors.toList());
  }

  public TotalProdutosEstoqueResponse recuperarQuantidadeProdutos() {
    List<EstoqueProdutos> estoques = estoqueRepository.listAll();
    Long total = estoques.stream()
      .mapToLong(EstoqueProdutos::getQuantidadeMovimentada)
      .sum();
    return new TotalProdutosEstoqueResponse(total);
  }
}
