package persistence.repository;

import interfaces.StatusPersistenceLayer;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import persistence.model.Status;

public class StatusRepository implements PanacheRepository<Status>, StatusPersistenceLayer{

}
