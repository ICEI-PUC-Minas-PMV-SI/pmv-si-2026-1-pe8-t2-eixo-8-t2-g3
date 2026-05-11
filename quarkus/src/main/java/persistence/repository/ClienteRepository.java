package persistence.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import persistence.model.Cliente;

@ApplicationScoped
public class ClienteRepository implements PanacheRepository<Cliente> {

}
