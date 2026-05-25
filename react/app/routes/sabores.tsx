import { useEffect, useState } from "react";
import {
  Title,
  Button,
  Table,
  Group,
  Stack,
  Badge,
  Modal,
  ActionIcon,
  Tooltip,
  Text,
  LoadingOverlay,
  Alert,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AppLayout } from "../components/AppLayout";
import { NomeForm } from "../components/NomeForm";
import { saboresApi, type Sabor } from "../lib/api";

export function meta() {
  return [{ title: "Sabores – Desejo Natural" }];
}

export default function Sabores() {
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState<Sabor | null>(null);
  const [modalAberto, { open, close }] = useDisclosure(false);

  async function carregar() {
    setErro("");
    setLoading(true);
    try {
      setSabores(await saboresApi.listar());
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function salvar(data: { nome: string }) {
    try {
      if (editando) {
        await saboresApi.atualizar(editando.id, data);
      } else {
        await saboresApi.criar(data);
      }
      close();
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  }

  async function alternarStatus(id: number) {
    try {
      await saboresApi.alternarStatus(id);
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  }

  const rows = sabores.map((s) => (
    <Table.Tr key={s.id}>
      <Table.Td>{s.id}</Table.Td>
      <Table.Td>{s.nome}</Table.Td>
      <Table.Td>
        <Badge color={s.ativo === false ? "red" : "green"} variant="light">
          {s.ativo === false ? "Inativo" : "Ativo"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Tooltip label="Editar">
            <ActionIcon variant="light" color="brand" onClick={() => { setEditando(s); open(); }}>
              ✏️
            </ActionIcon>
          </Tooltip>
          <Tooltip label={s.ativo === false ? "Ativar" : "Desativar"}>
            <ActionIcon
              variant="light"
              color={s.ativo === false ? "green" : "orange"}
              onClick={() => alternarStatus(s.id)}
            >
              {s.ativo === false ? "✅" : "🔒"}
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
          <Title order={2} c="brand.9">Sabores</Title>
          <Button color="brand" onClick={() => { setEditando(null); open(); }}>
            + Novo Sabor
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
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed" py="md">Nenhum sabor cadastrado</Text>
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
        title={editando ? "Editar Sabor" : "Novo Sabor"}
        centered
      >
        <NomeForm
          inicial={editando?.nome}
          onSalvar={(nome) => salvar({ nome })}
          onCancelar={close}
        />
      </Modal>
    </AppLayout>
  );
}
