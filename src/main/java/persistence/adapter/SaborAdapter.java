package persistence.adapter;

import dto.request.SaborRequest;
import dto.response.SaborResponse;
import jakarta.enterprise.context.ApplicationScoped;
import persistence.model.Sabor;

@ApplicationScoped
public class SaborAdapter implements Adapter<SaborRequest, SaborResponse, Sabor> {

    @Override
    public SaborResponse toResponse(Sabor model) {
        return new SaborResponse(
          model.id,
          model.getNome(),
          model.getIndicadorAtivo()
        );
    }

    @Override
    public Sabor toEntity(SaborRequest request) {
        return new Sabor(
                
        );
    }

}
