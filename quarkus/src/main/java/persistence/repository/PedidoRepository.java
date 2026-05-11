package persistence.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import persistence.model.Pedido;

@ApplicationScoped
public class PedidoRepository implements PanacheRepository<Pedido>{

}
