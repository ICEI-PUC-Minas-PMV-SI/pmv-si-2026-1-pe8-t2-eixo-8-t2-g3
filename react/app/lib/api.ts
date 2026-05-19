import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => { console.log("✅", res.config.url, res.status); return res; },
  (err) => { console.log("❌", err.config?.url, err.message); return Promise.reject(err); }
);

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  ativo?: boolean;
}

export interface Sabor {
  id: number;
  nome: string;
  ativo?: boolean;
}

export interface Estoque {
  id?: number;
  saborId: number;
  saborNome?: string;
  quantidadeMovimentada: number;
  validadeDias: number;
  quantidadeTotal?: number;
}

export interface Status {
  id: number;
  nome: string;
  ativo?: boolean;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteNome?: string;
  saborId: number;
  saborNome?: string;
  quantidade: number;
  statusId?: number;
  statusNome?: string;
  finalizado?: boolean;
  cancelado?: boolean;
}

// ── Clientes ───────────────────────────────────────────────────────────────

export const clientesApi = {
  listar: async () => (await api.get<Cliente[]>("/clientes")).data,
  obter: async (id: number) => (await api.get<Cliente>(`/clientes/${id}`)).data,
  criar: async (body: { nome: string; telefone: string }) => (await api.post<Cliente>("/clientes", body)).data,
  atualizar: async (id: number, body: { nome: string; telefone: string }) => (await api.put<Cliente>(`/clientes/${id}`, body)).data,
  alternarStatus: async (id: number) => (await api.post<Cliente>(`/clientes/${id}/status`)).data,
};
// ── Sabores ────────────────────────────────────────────────────────────────

export const saboresApi = {
  listar: async () => (await api.get<Sabor[]>("/sabores")).data,
  criar: async (body: { nome: string }) => (await api.post<Sabor>("/sabores", body)).data,
  atualizar: async (id: number, body: { nome: string }) => (await api.put<Sabor>(`/sabores/${id}`, body)).data,
  alternarStatus: async (id: number) => (await api.put<Sabor>(`/sabores/${id}/status`)).data,
};

// ── Estoque ────────────────────────────────────────────────────────────────

export const estoqueApi = {
  listar: async () => (await api.get<Estoque[]>("/estoque")).data,
  obterPorSabor: async (saborId: number) => (await api.get<Estoque>(`/estoque/${saborId}`)).data,
  criar: async (body: { saborId: number; quantidadeMovimentada: number; validadeDias: number }) =>
    (await api.post<Estoque>("/estoque", body)).data,
};

// ── Pedidos ────────────────────────────────────────────────────────────────

export const pedidosApi = {
  listar: async () => (await api.get<Pedido[]>("/pedidos")).data,
  obter: async (id: number) => (await api.get<Pedido>(`/pedidos/${id}`)).data,
  obterPorCliente: async (clienteId: number) => (await api.get<Pedido[]>(`/pedidos/cliente/${clienteId}`)).data,
  criar: async (body: { clienteId: number; saborId: number; quantidade: number }) =>
    (await api.post<Pedido>("/pedidos", body)).data,
  atualizar: async (id: number, body: { quantidade: number }) => (await api.put<Pedido>(`/pedidos/${id}`, body)).data,
  cancelar: async (id: number) => (await api.delete<Pedido>(`/pedidos/${id}`)).data,
  finalizar: async (id: number) => (await api.post<Pedido>(`/pedidos/${id}/finalizar`)).data,
};

// ── Status ─────────────────────────────────────────────────────────────────

export const statusApi = {
  listar: async () => (await api.get<Status[]>("/status")).data,
  obter: async (id: number) => (await api.get<Status>(`/status/${id}`)).data,
  criar: async (body: { nome: string }) => (await api.post<Status>("/status", body)).data,
  atualizar: async (id: number, body: { nome: string }) => (await api.put<Status>(`/status/${id}`, body)).data,
  alternar: async (id: number) => (await api.post<Status>(`/status/${id}/alternar`)).data,
};
