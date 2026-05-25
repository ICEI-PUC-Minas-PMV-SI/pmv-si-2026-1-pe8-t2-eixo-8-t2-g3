import { useEffect, useState } from "react";
import {
  Title,
  Button,
  Table,
  Group,
  Stack,
  Badge,
  Modal,
  NumberInput,
  Select,
  ActionIcon,
  Tooltip,
  Text,
  LoadingOverlay,
  Alert,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AppLayout } from "../components/AppLayout";
import {
  pedidosApi,
  clientesApi,
  saboresApi,
  type Pedido,
  type Cliente,
  type Sabor,
} from "../lib/api";

export function meta() {
  return [{ title: "Pedidos – Desejo Natural" }];
}

function PedidoForm({
  clientes,
  sabores,
  inicial,
  onSalvar,
  onCancelar,
}: {
  clientes: Cliente[];
  sabores: Sabor[];
  inicial?: Partial<Pedido>;
  onSalvar: (d: any) => Promise<void>;
  onCancelar: () => void;
}) {
  const editando = !!inicial?.id;
  const [clienteId, setClienteId] = useState<string | null>(
    inicial?.clienteId ? String(inicial.clienteId) : null
  );
  const [saborId, setSaborId] = useState<string | null>(
    inicial?.saborId ? String(inicial.saborId) : null
  );
  const [quantidade, setQuantidade] = useState<number | string>(inicial?.quantidade ?? 1);
  const [valorUnitario, setValorUnitario] = useState<number | string>(inicial?.valorUnitario ?? "");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      if (editando) {
        await onSalvar({ quantidade: Number(quantidade), valorUnitario: Number(valorUnitario) || undefined });
      } else {
        if (!clienteId || !saborId) return setErro("Preencha todos os campos");
        await onSalvar({
          clienteId: Number(clienteId),
          saborId: Number(saborId),
          quantidade: Number(quantidade),
          valorUnitario: Number(valorUnitario) || undefined,
        });
      }
    } catch (err: any) {
      setErro(err.message ?? "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="sm">
        {erro && <Alert color="red">{erro}</Alert>}
        {!editando && (
          <>
            <Select
              label="Cliente"
              data={clientes.map((c) => ({ value: String(c.id), label: c.nome }))}
              value={clienteId}
              onChange={setClienteId}
              required
              searchable
            />
            <Select
              label="Sabor"
              data={sabores.map((s) => ({ value: String(s.id), label: s.nome }))}
              value={saborId}
              onChange={setSaborId}
              required
              searchable
            />
          </>
        )}
        <NumberInput
          label="Quantidade"
          value={quantidade}
          onChange={setQuantidade}
          min={1}
          required
        />
        <NumberInput
          label="Valor Unitário (R$)"
          value={valorUnitario}
          onChange={setValorUnitario}
          min={0}
          decimalScale={2}
          fixedDecimalScale
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancelar}>Cancelar</Button>
          <Button type="submit" color="brand" loading={loading}>Salvar</Button>
        </Group>
      </Stack>
    </form>
  );
}

function formatarValor(valor?: number) {
  if (valor == null) return "—";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function statusBadge(p: Pedido) {
  if (p.cancelado) return <Badge color="red" variant="light">Cancelado</Badge>;
  if (p.finalizado) return <Badge color="green" variant="light">Finalizado</Badge>;
  if (p.statusNome) return <Badge color="brand" variant="light">{p.statusNome}</Badge>;
  return <Badge color="gray" variant="light">Aberto</Badge>;
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState<Pedido | null>(null);
  const [modalAberto, { open, close }] = useDisclosure(false);

  async function carregar() {
    setLoading(true);
    try {
      const [p, c, s] = await Promise.all([
        pedidosApi.listar(),
        clientesApi.listar(),
        saboresApi.listar(),
      ]);
      setPedidos(p);
      setClientes(c);
      setSabores(s);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function nomeCliente(id?: number) {
    return clientes.find((c) => c.id === id)?.nome ?? id ?? "–";
  }
  function nomeSabor(id?: number) {
    return sabores.find((s) => s.id === id)?.nome ?? id ?? "–";
  }

  async function salvar(data: any) {
    if (editando) {
      await pedidosApi.atualizar(editando.id, data);
    } else {
      await pedidosApi.criar(data);
    }
    close();
    carregar();
  }

  async function cancelar(id: number) {
    if (!confirm("Confirma o cancelamento do pedido?")) return;
    await pedidosApi.cancelar(id);
    carregar();
  }

  async function finalizar(id: number) {
    if (!confirm("Confirma a finalização do pedido?")) return;
    await pedidosApi.finalizar(id);
    carregar();
  }

  const rows = pedidos.map((p) => {
    const encerrado = p.cancelado || p.finalizado;
    return (
      <Table.Tr key={p.id}>
        <Table.Td>{p.id}</Table.Td>
        <Table.Td>{p.clienteNome ?? nomeCliente(p.clienteId)}</Table.Td>
        <Table.Td>{p.saborNome ?? nomeSabor(p.saborId)}</Table.Td>
        <Table.Td>{p.quantidade}</Table.Td>
        <Table.Td>{formatarValor(p.valorUnitario)}</Table.Td>
        <Table.Td>{statusBadge(p)}</Table.Td>
        <Table.Td>
          <Group gap="xs">
            {!encerrado && (
              <>
                <Tooltip label="Editar">
                  <ActionIcon
                    variant="light"
                    color="brand"
                    onClick={() => { setEditando(p); open(); }}
                  >
                    ✏️
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Finalizar">
                  <ActionIcon variant="light" color="green" onClick={() => finalizar(p.id)}>
                    ✅
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Cancelar">
                  <ActionIcon variant="light" color="red" onClick={() => cancelar(p.id)}>
                    ❌
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <AppLayout>
      <Stack p="md" gap="md">
        <Group justify="space-between">
          <Title order={2} c="brand.9">Pedidos</Title>
          <Button color="brand" onClick={() => { setEditando(null); open(); }}>
            + Novo Pedido
          </Button>
        </Group>

        {erro && <Alert color="red">{erro}</Alert>}

        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Sabor</Table.Th>
                <Table.Th>Qtd.</Table.Th>
                <Table.Th>Valor Unitário</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" py="md">Nenhum pedido encontrado</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Box>
      </Stack>

      <Modal
        opened={modalAberto}
        onClose={close}
        title={editando ? "Editar Pedido" : "Novo Pedido"}
        centered
      >
        <PedidoForm
          clientes={clientes}
          sabores={sabores}
          inicial={editando ?? {}}
          onSalvar={salvar}
          onCancelar={close}
        />
      </Modal>
    </AppLayout>
  );
}
