package persistence.model;

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
@Table(name = "estoque_produtos")
public class EstoqueProdutos extends PanacheEntity {
  @ManyToOne
  @JoinColumn(name = "sabor_id", nullable = false)
  private Sabor sabor;

  @Column(name = "quantidade_movimentada", nullable = false)
  private Integer quantidadeMovimentada;
  
  @Column(name = "validade_dias", nullable = true)
  private Integer validadeDias;

}
