package persistence.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import persistence.model.Sabor;

@ApplicationScoped
public class SaborRepository implements PanacheRepository<Sabor> {

}
