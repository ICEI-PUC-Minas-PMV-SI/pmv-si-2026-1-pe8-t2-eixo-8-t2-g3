package controller;

import java.util.List;

import dto.request.StatusRequest;
import dto.response.StatusResponse;
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
import service.StatusService;

@Path("/api/status")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StatusController {
  
  @Inject
  StatusService service;

  @GET
  public Response listarTodos() {
    try {
      List<StatusResponse> statuses = service.listarTodos();
      return Response.ok(statuses).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao listar status").build();
    }
  }

  @GET
  @Path("/{id}")
  public Response obterPorId(@PathParam("id") Long id) {
    try {
      StatusResponse status = service.obterPorId(id);
      return Response.ok(status).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao obter status").build();
    }
  }

  @POST
  public Response criar(StatusRequest input) {
    try {
      StatusResponse status = service.criar(input);
      return Response.status(Response.Status.CREATED).entity(status).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao criar status").build();
    }
  }

  @PUT
  @Path("/{id}")
  public Response atualizar(@PathParam("id") Long id, StatusRequest input) {
    try {
      StatusResponse status = service.atualizar(id, input);
      return Response.ok(status).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao atualizar status").build();
    }
  }

  @POST
  @Path("/{id}/alternar")
  public Response alternarStatus(@PathParam("id") Long id) {
    try {
      service.alternarStatus(id);
      return Response.noContent().build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao alterar status").build();
    }
  }
}
