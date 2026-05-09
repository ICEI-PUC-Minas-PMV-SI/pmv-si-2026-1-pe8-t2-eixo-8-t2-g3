package controller;

import java.util.List;

import dto.request.ClienteRequest;
import dto.response.ClienteResponse;
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
import service.ClienteService;

@Path("/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteController {
  
  @Inject
  ClienteService service;

  @GET
  public Response listarTodos() {
    try {
      List<ClienteResponse> clientes = service.listarTodos();
      return Response.ok(clientes).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao listar clientes").build();
    }
  }

  @POST
  public Response criar(ClienteRequest input) {
    try {
      ClienteResponse cliente = service.criar(input);
      return Response.status(Response.Status.CREATED).entity(cliente).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao criar cliente").build();
    }
  }

  @GET
  @Path("/{id}")
  public Response obterPorId(@PathParam("id") Long id) {
    try {
      ClienteResponse cliente = service.obterPorId(id);
      return Response.ok(cliente).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao obter cliente").build();
    }
  }

  @PUT
  @Path("/{id}")
  public Response atualizar(@PathParam("id") Long id, ClienteRequest input) {
    try {
      ClienteResponse cliente = service.atualizar(id, input);
      return Response.ok(cliente).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao atualizar cliente").build();
    }
  }

  @POST
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
        .entity("Erro ao alterar status do cliente").build();
    }
  }
}
