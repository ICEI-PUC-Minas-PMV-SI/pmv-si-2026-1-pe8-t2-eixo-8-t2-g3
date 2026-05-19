import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("clientes", "routes/clientes.tsx"),
  route("sabores", "routes/sabores.tsx"),
  route("estoque", "routes/estoque.tsx"),
  route("pedidos", "routes/pedidos.tsx"),
  route("status", "routes/status.tsx"),
] satisfies RouteConfig;
