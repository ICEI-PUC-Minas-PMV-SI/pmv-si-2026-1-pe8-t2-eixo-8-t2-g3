import { useEffect, useState } from "react";
import {
  Title,
  Button,
  Table,
  Group,
  Stack,
  Badge,
  Modal,
  TextInput,
  ActionIcon,
  Tooltip,
  Text,
  LoadingOverlay,
  Alert,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AppLayout } from "../components/AppLayout";
import { clientesApi, type Cliente } from "../lib/api";

export function meta() {
  return [{ title: "Clientes – Desejo Natural" }];
}

function ClienteForm({
  inicial,
  onSalvar,
  onCancelar,
}: {
  inicial?: Partial<Cliente>;
  onSalvar: (d: { nome: string; telefone: string }) => Promise<void>;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [telefone, setTelefone] = useState(inicial?.telefone ?? "");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return setErro("Nome é obrigatório");
    setLoading(true);
    setErro("");
    try {
      await onSalvar({ nome: nome.trim(), telefone: telefone.trim() });
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
        <TextInput
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="submit" color="brand" loading={loading}>
            Salvar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [modalAberto, { open, close }] = useDisclosure(false);
  const { listar, criar, atualizar, alternarStatus } = clientesApi;
  async function carregar() {
    setErro("");
    setLoading(true);
    try {
      setClientes(await listar());
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function abrirNovo() {
    setEditando(null);
    open();
  }

  function abrirEditar(c: Cliente) {
    setEditando(c);
    open();
  }

  async function salvar(data: { nome: string; telefone: string }) {
    try {
      if (editando) {
        await atualizar(editando.id, data);
      } else {
        await criar(data);
      }
      close();
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  }

  async function alternarStatusCliente(id: number) {
    try {
      await alternarStatus(id);
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  }

  const rows = clientes.map((c) => (
    <Table.Tr key={c.id}>
      <Table.Td>{c.id}</Table.Td>
      <Table.Td>{c.nome}</Table.Td>
      <Table.Td>{c.telefone}</Table.Td>
      <Table.Td>
        <Badge color={c.ativo === false ? "red" : "green"} variant="light">
          {c.ativo === false ? "Inativo" : "Ativo"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Tooltip label="Editar">
            <ActionIcon variant="light" color="brand" onClick={() => abrirEditar(c)}>
              ✏️
            </ActionIcon>
          </Tooltip>
          <Tooltip label={c.ativo === false ? "Ativar" : "Desativar"}>
            <ActionIcon
              variant="light"
              color={c.ativo === false ? "green" : "orange"}
              onClick={() => alternarStatusCliente(c.id)}
            >
              {c.ativo === false ? "✅" : "🔒"}
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <AppLayout>
      <Stack p="md" gap="md">
        <Group justify="space-between">
          <Title order={2} c="brand.9">Clientes</Title>
          <Button color="brand" onClick={abrirNovo}>
            + Novo Cliente
          </Button>
        </Group>

        {erro && <Alert color="red">{erro}</Alert>}

        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Telefone</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="md">Nenhum cliente cadastrado</Text>
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
        title={editando ? "Editar Cliente" : "Novo Cliente"}
        centered
      >
        <ClienteForm
          inicial={editando ?? {}}
          onSalvar={salvar}
          onCancelar={close}
        />
      </Modal>
    </AppLayout>
  );
}
