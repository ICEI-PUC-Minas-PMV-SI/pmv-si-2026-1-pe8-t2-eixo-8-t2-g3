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
import { statusApi, type Status } from "../lib/api";

export function meta() {
  return [{ title: "Status – Desejo Natural" }];
}

export default function StatusPage() {
  const [lista, setLista] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState<Status | null>(null);
  const [modalAberto, { open, close }] = useDisclosure(false);

  async function carregar() {
    setErro("");
    setLoading(true);
    try {
      setLista(await statusApi.listar());
    } catch (e: any) {
      setErro(e.message);
      setLista([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function salvar(data: { nome: string }) {
    try {
      if (editando) {
        await statusApi.atualizar(editando.id, data);
      } else {
        await statusApi.criar(data);
      }
      close();
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  }

  async function alternar(id: number) {
    try {
      await statusApi.alternar(id);
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  }

  const rows = lista.map((s) => (
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
              onClick={() => alternar(s.id)}
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
          <Title order={2} c="brand.9">Status</Title>
          <Button color="brand" onClick={() => { setEditando(null); open(); }}>
            + Novo Status
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
                <Table.Th>Ativo</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed" py="md">Nenhum status cadastrado</Text>
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
        title={editando ? "Editar Status" : "Novo Status"}
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
