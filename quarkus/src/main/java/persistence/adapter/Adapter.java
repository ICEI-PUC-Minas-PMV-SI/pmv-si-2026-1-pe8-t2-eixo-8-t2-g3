package persistence.adapter;

public interface Adapter<Request, Response, Entity> {
    Response toResponse(Entity entity);
    Entity toEntity(Request request);
}
