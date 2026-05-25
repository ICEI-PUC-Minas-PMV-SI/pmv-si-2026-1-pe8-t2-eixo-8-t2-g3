package service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import dto.request.PedidoRequest;
import dto.response.PedidoResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import persistence.model.Cliente;
import persistence.model.Pedido;
import persistence.model.Sabor;
import persistence.model.Status;
import persistence.repository.ClienteRepository;
import persistence.repository.PedidoRepository;
import persistence.repository.SaborRepository;
import persistence.repository.StatusRepository;

@ApplicationScoped
public class PedidoService {
  
  @Inject
  PedidoRepository repository;
  
  @Inject
  ClienteRepository clienteRepository;
  
  @Inject
  SaborRepository saborRepository;
  
  @Inject
  StatusRepository statusRepository;
  
  public List<PedidoResponse> listarTodos() {
    List<Pedido> pedidos = repository.listAll();
    return pedidos.stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  public PedidoResponse obterPorId(Long id) {
    Pedido pedido = repository.findById(id);
    if (pedido == null) {
      throw new IllegalArgumentException("Pedido não encontrado");
    }
    return toResponse(pedido);
  }

  public List<PedidoResponse> obterPorCliente(Long clienteId) {
    Cliente cliente = clienteRepository.findById(clienteId);
    if (cliente == null) {
      throw new IllegalArgumentException("Cliente não encontrado");
    }
    List<Pedido> pedidos = repository.list("cliente.id", clienteId);
    return pedidos.stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  @Transactional
  public PedidoResponse criar(PedidoRequest input) {
    try {
      Cliente cliente = clienteRepository.findById(input.clienteId());
      if (cliente == null) {
        throw new IllegalArgumentException("Cliente não encontrado");
      }
      
      Sabor sabor = saborRepository.findById(input.saborId());
      if (sabor == null) {
        throw new IllegalArgumentException("Sabor não encontrado");
      }

      if (!sabor.getIndicadorAtivo()) {
        throw new IllegalArgumentException("Sabor inativo");
      }

      List<Status> statusList = statusRepository.list("nome", "Pendente");
      if (statusList.isEmpty()) {
        throw new IllegalArgumentException("Status 'Pendente' não configurado");
      }
      Status statusPendente = statusList.get(0);

      Pedido pedido = new Pedido();
      pedido.setCliente(cliente);
      pedido.setSabor(sabor);
      pedido.setStatus(statusPendente);
      pedido.setQuantidade(input.quantidade());
      pedido.setDataPedido(LocalDate.now());
      pedido.setValorUnitario(input.valorUnitario());
      pedido.persist();
      
      return toResponse(pedido);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao criar pedido: " + e.getMessage(), e);
    }
  }

  @Transactional
  public PedidoResponse atualizar(Long id, PedidoRequest input) {
    try {
      Pedido pedido = repository.findById(id);
      if (pedido == null) {
        throw new IllegalArgumentException("Pedido não encontrado");
      }
      pedido.setQuantidade(input.quantidade());
      pedido.persist();
      return toResponse(pedido);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao atualizar pedido: " + e.getMessage(), e);
    }
  }

  @Transactional
  public void cancelar(Long id) {
    try {
      Pedido pedido = repository.findById(id);
      if (pedido == null) {
        throw new IllegalArgumentException("Pedido não encontrado");
      }
      
      List<Status> statusList = statusRepository.list("nome", "Cancelado");
      if (statusList.isEmpty()) {
        throw new IllegalArgumentException("Status 'Cancelado' não configurado");
      }
      Status statusCancelado = statusList.get(0);
      
      pedido.setStatus(statusCancelado);
      pedido.persist();
    } catch (Exception e) {
      throw new RuntimeException("Erro ao cancelar pedido: " + e.getMessage(), e);
    }
  }

  @Transactional
  public void finalizar(Long id) {
    try {
      Pedido pedido = repository.findById(id);
      if (pedido == null) {
        throw new IllegalArgumentException("Pedido não encontrado");
      }
      
      List<Status> statusList = statusRepository.list("nome", "Finalizado");
      if (statusList.isEmpty()) {
        throw new IllegalArgumentException("Status 'Finalizado' não configurado");
      }
      Status statusFinalizado = statusList.get(0);
      
      // TODO: Dar baixa no estoque
      
      pedido.setStatus(statusFinalizado);
      pedido.persist();
    } catch (Exception e) {
      throw new RuntimeException("Erro ao finalizar pedido: " + e.getMessage(), e);
    }
  }

  private PedidoResponse toResponse(Pedido pedido) {
    return new PedidoResponse(
      pedido.id,
      pedido.getCliente().id,
      pedido.getCliente().getNome(),
      pedido.getSabor().id,
      pedido.getSabor().getNome(),
      pedido.getQuantidade(),
      pedido.getDataPedido(),
      pedido.getStatus().getNome(),
      pedido.getValorUnitario()
    );
  }
}
