package controller;

import java.util.List;

import dto.request.PedidoRequest;
import dto.response.PedidoResponse;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import service.PedidoService;

@Path("/api/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PedidoController {
  
  @Inject
  PedidoService service;

  @GET
  public Response listarTodos() {
    try {
      List<PedidoResponse> pedidos = service.listarTodos();
      return Response.ok(pedidos).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao listar pedidos").build();
    }
  }

  @POST
  public Response criar(PedidoRequest input) {
    try {
      PedidoResponse pedido = service.criar(input);
      return Response.status(Response.Status.CREATED).entity(pedido).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao criar pedido").build();
    }
  }

  @GET
  @Path("/cliente/{clienteId}")
  public Response obterPorCliente(@PathParam("clienteId") Long clienteId) {
    try {
      List<PedidoResponse> pedidos = service.obterPorCliente(clienteId);
      return Response.ok(pedidos).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao listar pedidos do cliente").build();
    }
  }

  @GET
  @Path("/{id}")
  public Response obterPorId(@PathParam("id") Long id) {
    try {
      PedidoResponse pedido = service.obterPorId(id);
      return Response.ok(pedido).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao obter pedido").build();
    }
  }

  @PUT
  @Path("/{id}")
  public Response atualizar(@PathParam("id") Long id, PedidoRequest input) {
    try {
      PedidoResponse pedido = service.atualizar(id, input);
      return Response.ok(pedido).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao atualizar pedido").build();
    }
  }

  @DELETE
  @Path("/{id}")
  public Response cancelar(@PathParam("id") Long id) {
    try {
      service.cancelar(id);
      return Response.noContent().build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao cancelar pedido").build();
    }
  }

  @POST
  @Path("/{id}/finalizar")
  public Response finalizar(@PathParam("id") Long id) {
    try {
      service.finalizar(id);
      return Response.noContent().build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.NOT_FOUND)
        .entity(e.getMessage()).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao finalizar pedido").build();
    }
  }
}
