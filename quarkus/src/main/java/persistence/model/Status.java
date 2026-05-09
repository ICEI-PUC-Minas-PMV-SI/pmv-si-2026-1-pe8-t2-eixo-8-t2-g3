package persistence.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "status")
public class Status extends PanacheEntity {
  @Column(name = "nome", nullable = false)
  private String nome;

  @Column(name = "indicador_ativo", nullable = false)
  private Boolean indicadorAtivo;
}
