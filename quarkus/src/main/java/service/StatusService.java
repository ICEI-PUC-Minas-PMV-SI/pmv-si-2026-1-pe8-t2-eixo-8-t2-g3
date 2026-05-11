package service;

import java.util.List;
import java.util.stream.Collectors;

import dto.request.StatusRequest;
import dto.response.StatusResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import persistence.model.Status;
import persistence.repository.StatusRepository;

@ApplicationScoped
public class StatusService {
  
  @Inject
  StatusRepository repository;
  
  public List<StatusResponse> listarTodos() {
    List<Status> statuses = repository.listAll();
    return statuses.stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  public StatusResponse obterPorId(Long id) {
    Status status = repository.findById(id);
    if (status == null) {
      throw new IllegalArgumentException("Status não encontrado");
    }
    return toResponse(status);
  }

  @Transactional
  public StatusResponse criar(StatusRequest input) {
    try {
      Status status = new Status();
      status.setNome(input.nome());
      status.setIndicadorAtivo(true);
      status.persist();
      return toResponse(status);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao criar status: " + e.getMessage(), e);
    }
  }

  @Transactional
  public StatusResponse atualizar(Long id, StatusRequest input) {
    try {
      Status status = repository.findById(id);
      if (status == null) {
        throw new IllegalArgumentException("Status não encontrado");
      }
      status.setNome(input.nome());
      status.persist();
      return toResponse(status);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao atualizar status: " + e.getMessage(), e);
    }
  }

  @Transactional
  public void alternarStatus(Long id) {
    try {
      Status status = repository.findById(id);
      if (status == null) {
        throw new IllegalArgumentException("Status não encontrado");
      }
      status.setIndicadorAtivo(!status.getIndicadorAtivo());
      status.persist();
    } catch (Exception e) {
      throw new RuntimeException("Erro ao alterar status: " + e.getMessage(), e);
    }
  }

  private StatusResponse toResponse(Status status) {
    return new StatusResponse(
      status.id,
      status.getNome(),
      status.getIndicadorAtivo()
    );
  }
}
