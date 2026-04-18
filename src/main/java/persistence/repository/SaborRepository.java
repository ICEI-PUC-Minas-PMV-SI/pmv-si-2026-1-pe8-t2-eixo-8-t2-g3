package persistence.repository;

import interfaces.SaborPersistenceLayer;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import persistence.model.Sabor;

public class SaborRepository implements PanacheRepository<Sabor>, SaborPersistenceLayer {

}
