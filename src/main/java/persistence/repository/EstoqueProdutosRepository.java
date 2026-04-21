package persistence.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import persistence.model.EstoqueProdutos;

@ApplicationScoped
public class EstoqueProdutosRepository implements PanacheRepository<EstoqueProdutos> {

}
