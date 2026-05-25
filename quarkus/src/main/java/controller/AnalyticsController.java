package controller;

import java.util.Map;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import service.AnalyticsService;

@Path("/api/analytics")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AnalyticsController {
  @Inject
  AnalyticsService service;

  @GET
  @Path("/clientes")
  public Response recuperarQuantidadeClientes() {
    try {
      Long quantidade = service.recuperarQuantidadeClientes();
      return Response.ok(quantidade).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao recuperar quantidade de clientes").build();
    }
  }

  @GET
  @Path("/vendas")
  public Response recuperarValorTotalVendasPorMes() {
    try {
      Map<String, Double> vendasPorMes = service.recuperarValorTotalVendasPorMes();
      return Response.ok(vendasPorMes).build();
    } catch (Exception e) { 
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao recuperar valor total de vendas").build();
    } 
  }

  @GET
  @Path("/produtos-estoque")
  public Response recuperarQuantidadeProdutos() {
    try {
      Long quantidade = service.recuperarQuantidadeProdutos();
      return Response.ok(quantidade).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
        .entity("Erro ao recuperar quantidade de produtos").build();
    }
  }
}