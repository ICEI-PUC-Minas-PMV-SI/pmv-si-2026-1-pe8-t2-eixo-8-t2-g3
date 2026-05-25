package controller;

import java.util.List;

import dto.request.EstoqueRequest;
import dto.response.EstoqueResponse;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import service.EstoqueService;

@Path("/api/estoque")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EstoqueController {
  
  @Inject
  EstoqueService service;

  @GET
  public Response listarTodos() {
    try {
      List<EstoqueResponse> estoques = service.listarTodos();
      return Response.ok(estoques).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao listar estoque").build();
    }
  }

  @POST
  public Response criar(EstoqueRequest input) {
    try {
      EstoqueResponse estoque = service.criar(input);
      return Response.status(Response.Status.CREATED).entity(estoque).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao criar movimentação de estoque").build();
    }
  }

  @GET
  @Path("/{saborId}")
  public Response obterPorSabor(@PathParam("saborId") Long saborId) {
    try {
      List<EstoqueResponse> estoques = service.listarPorSabor(saborId);
      return Response.ok(estoques).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao obter estoque do sabor").build();
    }
  }
}
