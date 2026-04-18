package persistence.repository;

import interfaces.ClientePersistenceLayer;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import persistence.model.Cliente;

public class ClienteRepository implements PanacheRepository<Cliente>, ClientePersistenceLayer {

}
