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
@Table(name = "clientes")
public class Cliente extends PanacheEntity{
  @Column(name = "nome", nullable = false)
  private String nome;

  @Column(name = "telefone", nullable = false)
  private String telefone;
}
