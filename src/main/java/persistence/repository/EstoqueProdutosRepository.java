package persistence.repository;

import interfaces.EstoqueProdutosPersistenceLayer;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import persistence.model.EstoqueProdutos;

public class EstoqueProdutosRepository implements PanacheRepository<EstoqueProdutos>, EstoqueProdutosPersistenceLayer {

}
