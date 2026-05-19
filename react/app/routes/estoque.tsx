import { useEffect, useState } from "react";
import {
  Title,
  Button,
  Table,
  Group,
  Stack,
  Modal,
  NumberInput,
  Select,
  Text,
  LoadingOverlay,
  Alert,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AppLayout } from "../components/AppLayout";
import { estoqueApi, saboresApi, type Estoque, type Sabor } from "../lib/api";

export function meta() {
  return [{ title: "Estoque – Desejo Natural" }];
}

function EstoqueForm({
  sabores,
  onSalvar,
  onCancelar,
}: {
  sabores: Sabor[];
  onSalvar: (d: { saborId: number; quantidadeMovimentada: number; validadeDias: number }) => Promise<void>;
  onCancelar: () => void;
}) {
  const [saborId, setSaborId] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState<number | string>(0);
  const [validade, setValidade] = useState<number | string>(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!saborId) return setErro("Selecione um sabor");
    setLoading(true);
    setErro("");
    try {
      await onSalvar({
        saborId: Number(saborId),
        quantidadeMovimentada: Number(quantidade),
        validadeDias: Number(validade),
      });
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
        <Select
          label="Sabor"
          data={sabores.map((s) => ({ value: String(s.id), label: s.nome }))}
          value={saborId}
          onChange={setSaborId}
          required
          searchable
        />
        <NumberInput
          label="Quantidade Movimentada"
          value={quantidade}
          onChange={setQuantidade}
          min={1}
          required
        />
        <NumberInput
          label="Validade (dias)"
          value={validade}
          onChange={setValidade}
          min={1}
          required
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancelar}>Cancelar</Button>
          <Button type="submit" color="brand" loading={loading}>Registrar</Button>
        </Group>
      </Stack>
    </form>
  );
}

export default function Estoque() {
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [modalAberto, { open, close }] = useDisclosure(false);

  async function carregar() {
    setLoading(true);
    try {
      const [e, s] = await Promise.all([estoqueApi.listar(), saboresApi.listar()]);
      setEstoque(e);
      setSabores(s);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function salvar(data: { saborId: number; quantidadeMovimentada: number; validadeDias: number }) {
    await estoqueApi.criar(data);
    close();
    carregar();
  }

  function nomeSabor(id?: number) {
    return sabores.find((s) => s.id === id)?.nome ?? id ?? "–";
  }

  const rows = estoque.map((e, i) => (
    <Table.Tr key={e.id ?? i}>
      <Table.Td>{e.id ?? "–"}</Table.Td>
      <Table.Td>{e.saborNome ?? nomeSabor(e.saborId)}</Table.Td>
      <Table.Td>{e.quantidadeMovimentada}</Table.Td>
      <Table.Td>{e.quantidadeTotal ?? "–"}</Table.Td>
      <Table.Td>{e.validadeDias} dias</Table.Td>
    </Table.Tr>
  ));

  return (
    <AppLayout>
      <Stack p="md" gap="md">
        <Group justify="space-between">
          <Title order={2} c="brand.9">Estoque</Title>
          <Button color="brand" onClick={open}>+ Registrar Movimentação</Button>
        </Group>

        {erro && <Alert color="red">{erro}</Alert>}

        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Sabor</Table.Th>
                <Table.Th>Qtd. Movimentada</Table.Th>
                <Table.Th>Qtd. Total</Table.Th>
                <Table.Th>Validade</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="md">Nenhuma movimentação registrada</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Box>
      </Stack>

      <Modal opened={modalAberto} onClose={close} title="Registrar Movimentação" centered>
        <EstoqueForm sabores={sabores} onSalvar={salvar} onCancelar={close} />
      </Modal>
    </AppLayout>
  );
}
