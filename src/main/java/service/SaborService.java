package service;

import java.util.List;
import java.util.stream.Collectors;

import dto.request.SaborRequest;
import dto.response.SaborResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import persistence.model.Sabor;
import persistence.repository.SaborRepository;

@ApplicationScoped
public class SaborService {
  
  @Inject
  SaborRepository repository;
  
  public List<SaborResponse> listarTodos() {
    List<Sabor> sabores = repository.listAll();
    return sabores.stream()
      .filter(s -> s.getIndicadorAtivo())
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  public SaborResponse obterPorId(Long id) {
    Sabor sabor = repository.findById(id);
    if (sabor == null) {
      throw new IllegalArgumentException("Sabor não encontrado");
    }
    return toResponse(sabor);
  }

  @Transactional
  public SaborResponse criar(SaborRequest input) {
    // TODO: Persistir nome em caps lock e validar unicidade
    try {
      if (input.nome() == null || input.nome().trim().isEmpty()) {
        throw new IllegalArgumentException("Nome é obrigatório");
      }
      
      Sabor sabor = new Sabor();
      sabor.setNome(input.nome());
      sabor.setIndicadorAtivo(true);
      sabor.persist();
      
      return toResponse(sabor);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao criar sabor: " + e.getMessage(), e);
    }
  }

  @Transactional
  public SaborResponse atualizar(Long id, SaborRequest input) {
    try {
      Sabor sabor = repository.findById(id);
      if (sabor == null) {
        throw new IllegalArgumentException("Sabor não encontrado");
      }
      
      if (input.nome() == null || input.nome().trim().isEmpty()) {
        throw new IllegalArgumentException("Nome é obrigatório");
      }
      
      sabor.setNome(input.nome());
      sabor.persist();
      
      return toResponse(sabor);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao atualizar sabor: " + e.getMessage(), e);
    }
  }

  @Transactional
  public void alternarStatus(Long id) {
    try {
      Sabor sabor = repository.findById(id);
      if (sabor == null) {
        throw new IllegalArgumentException("Sabor não encontrado");
      }
      
      sabor.setIndicadorAtivo(!sabor.getIndicadorAtivo());
      sabor.persist();
    } catch (Exception e) {
      throw new RuntimeException("Erro ao alterar status do sabor: " + e.getMessage(), e);
    }
  }

  private SaborResponse toResponse(Sabor sabor) {
    return new SaborResponse(
      sabor.id,
      sabor.getNome(),
      sabor.getIndicadorAtivo()
    );
  }
}
