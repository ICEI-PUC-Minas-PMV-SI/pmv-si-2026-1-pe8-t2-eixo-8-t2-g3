package service;

import java.util.List;
import java.util.stream.Collectors;

import dto.request.ClienteRequest;
import dto.response.ClienteResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import persistence.model.Cliente;
import persistence.repository.ClienteRepository;

@ApplicationScoped
public class ClienteService {
  @Inject
  ClienteRepository repository;
  
  public List<ClienteResponse> listarTodos() {
    List<Cliente> clientes = repository.listAll();
    return clientes.stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  public ClienteResponse obterPorId(Long id) {
    Cliente cliente = repository.findById(id);
    if (cliente == null) {
      throw new IllegalArgumentException("Cliente não encontrado");
    }
    return toResponse(cliente);
  }

  @Transactional
  public ClienteResponse criar(ClienteRequest input) {
    try {
      validarInput(input.nome(), input.telefone());
      Cliente cliente = new Cliente();
      cliente.setNome(input.nome());
      cliente.setTelefone(input.telefone());
      cliente.setIndicadorAtivo(true);
      cliente.persist();
      return toResponse(cliente);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao criar cliente: " + e.getMessage(), e);
    }
  }

  @Transactional
  public ClienteResponse atualizar(Long id, ClienteRequest input) {
    try {
      Cliente cliente = repository.findById(id);
      if (cliente == null) {
        throw new IllegalArgumentException("Cliente não encontrado");
      }
      validarInput(input.nome(), input.telefone());
      cliente.setNome(input.nome());
      cliente.setTelefone(input.telefone());
      cliente.persist();
      return toResponse(cliente);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao atualizar cliente: " + e.getMessage(), e);
    }
  }

  @Transactional
  public void alternarStatus(Long id) {
    try {
      Cliente cliente = repository.findById(id);
      if (cliente == null) {
        throw new IllegalArgumentException("Cliente não encontrado");
      }
      cliente.setIndicadorAtivo(!cliente.getIndicadorAtivo());
      cliente.persist();
    } catch (Exception e) {
      throw new RuntimeException("Erro ao alterar status do cliente: " + e.getMessage(), e);
    }
  }

  private void validarInput(String nome, String telefone) {
    if (nome == null || nome.trim().isEmpty()) {
      throw new IllegalArgumentException("Nome é obrigatório");
    }
    if (telefone == null || telefone.trim().isEmpty()) {
      throw new IllegalArgumentException("Telefone é obrigatório");
    }
  }

  private ClienteResponse toResponse(Cliente cliente) {
    return new ClienteResponse(
      cliente.id,
      cliente.getNome(),
      cliente.getTelefone(),
      cliente.getIndicadorAtivo()
    );
  }
}
