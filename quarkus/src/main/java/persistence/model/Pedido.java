package persistence.model;

import java.time.LocalDate;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "pedidos")
public class Pedido extends PanacheEntity {
  @ManyToOne
  @JoinColumn(name = "cliente_id", nullable = false)
  private Cliente cliente;

  @ManyToOne
  @JoinColumn(name = "sabor_id", nullable = false)
  private Sabor sabor;

  @ManyToOne
  @JoinColumn(name = "status_id", nullable = false)
  private Status status;

  @Column(name = "quantidade", nullable = false)
  private Integer quantidade;

  @Column(name = "data_pedido", nullable = false)
  private LocalDate dataPedido;

  @Column(name = "valor_unitario", nullable = false)
  private Double valorUnitario;
}
