package service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import dto.request.EstoqueRequest;
import dto.response.EstoqueResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import persistence.model.EstoqueProdutos;
import persistence.model.Sabor;
import persistence.repository.EstoqueProdutosRepository;
import persistence.repository.SaborRepository;

@ApplicationScoped
public class EstoqueService {
  
  @Inject
  EstoqueProdutosRepository repository;
  
  @Inject
  SaborRepository saborRepository;
  
  public EstoqueResponse obterPorSabor(Long saborId) {
    Sabor sabor = saborRepository.findById(saborId);
    if (sabor == null) {
      throw new IllegalArgumentException("Sabor não encontrado");
    }
    
    List<EstoqueProdutos> estoques = repository.list("sabor.id", saborId);
    if (estoques.isEmpty()) {
      throw new IllegalArgumentException("Estoque não encontrado para o sabor");
    }
    
    return toResponse(estoques.get(0));
  }

  public List<EstoqueResponse> listarTodos() {
    List<EstoqueProdutos> estoques = repository.listAll();
    return estoques.stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  public List<EstoqueResponse> listarPorSabor(Long saborId) {
    Sabor sabor = saborRepository.findById(saborId);
    if (sabor == null) {
      throw new IllegalArgumentException("Sabor não encontrado");
    }
    
    List<EstoqueProdutos> estoques = repository.list("sabor.id", saborId);
    return estoques.stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  @Transactional
  public EstoqueResponse criar(EstoqueRequest input) {
    try {
      Sabor sabor = saborRepository.findById(input.saborId());
      if (sabor == null) {
        throw new IllegalArgumentException("Sabor não encontrado");
      }

      if (input.quantidadeMovimentada() == null || input.quantidadeMovimentada() == 0) {
        throw new IllegalArgumentException("Quantidade deve ser diferente de zero");
      }

      EstoqueProdutos estoque = new EstoqueProdutos();
      estoque.setSabor(sabor);
      estoque.setQuantidadeMovimentada(input.quantidadeMovimentada());
      estoque.setValidadeDias(input.validadeDias());
      estoque.setDataCriacao(LocalDateTime.now());
      estoque.setDataAtualizacao(LocalDateTime.now());
      estoque.persist();
      
      return toResponse(estoque);
    } catch (Exception e) {
      throw new RuntimeException("Erro ao criar movimentação de estoque: " + e.getMessage(), e);
    }
  }

  private EstoqueResponse toResponse(EstoqueProdutos estoque) {
    return new EstoqueResponse(
      estoque.id,
      estoque.getSabor().id,
      estoque.getSabor().getNome(),
      estoque.getQuantidadeMovimentada(),
      estoque.getValidadeDias(),
      estoque.getDataCriacao(),
      estoque.getDataAtualizacao()
    );
  }
}
