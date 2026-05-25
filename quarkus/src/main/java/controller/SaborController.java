package controller;

import java.util.List;

import dto.request.SaborRequest;
import dto.response.SaborResponse;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import service.SaborService;

@Path("/api/sabores")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SaborController {
  
  @Inject
  SaborService service;

  @GET
  public Response listarTodos() {
    try {
      List<SaborResponse> sabores = service.listarTodos();
      return Response.ok(sabores).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao listar sabores").build();
    }
  }

  @POST
  public Response criar(SaborRequest input) {
    try {
      SaborResponse sabor = service.criar(input);
      return Response.status(Response.Status.CREATED).entity(sabor).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao criar sabor").build();
    }
  }

  @PUT
  @Path("/{id}")
  public Response atualizar(@PathParam("id") Long id, SaborRequest input) {
    try {
      SaborResponse sabor = service.atualizar(id, input);
      return Response.ok(sabor).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao atualizar sabor").build();
    }
  }

  @PUT
  @Path("/{id}/status")
  public Response alternarStatus(@PathParam("id") Long id) {
    try {
      service.alternarStatus(id);
      return Response.noContent().build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao alterar status do sabor").build();
    }
  }
}
