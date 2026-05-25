package config;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import io.quarkus.runtime.StartupEvent;
import persistence.model.Status;
import persistence.repository.StatusRepository;

// Classe pensada para popular a tabela de status com os valores iniciais necessários para o funcionamento do sistema.
@ApplicationScoped
public class DataSeeder {

  @Inject
  StatusRepository statusRepository;

  @Transactional
  void onStart(@Observes StartupEvent event) {
    seedStatus("Pendente");
    seedStatus("Cancelado");
    seedStatus("Finalizado");
  }

  private void seedStatus(String nome) {
    long count = statusRepository.count("nome", nome);
    if (count == 0) {
      Status status = new Status();
      status.setNome(nome);
      status.setIndicadorAtivo(true);
      status.persist();
    }
  }
}
