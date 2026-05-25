import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Title,
  Button,
  Table,
  Group,
  Stack,
  Modal,
  NumberInput,
  Select,
  SegmentedControl,
  Text,
  LoadingOverlay,
  Alert,
  Box,
  Badge,
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
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
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
      const qtd = Number(quantidade);
      await onSalvar({
        saborId: Number(saborId),
        quantidadeMovimentada: tipo === "saida" ? -qtd : qtd,
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
        <SegmentedControl
          value={tipo}
          onChange={(v) => setTipo(v as "entrada" | "saida")}
          data={[
            { value: "entrada", label: "Entrada" },
            { value: "saida", label: "Saída" },
          ]}
          fullWidth
        />
        <NumberInput
          label="Quantidade"
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

interface ProdutoEstoque {
  saborId: number;
  saborNome: string;
  quantidadeTotal: number;
  proximaValidade: string | null;
}

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

function agruparPorProduto(movimentos: Estoque[], sabores: Sabor[]): ProdutoEstoque[] {
  const mapa = new Map<number, ProdutoEstoque>();

  for (const m of movimentos) {
    let grupo = mapa.get(m.saborId);
    if (!grupo) {
      grupo = {
        saborId: m.saborId,
        saborNome: m.saborNome ?? sabores.find((s) => s.id === m.saborId)?.nome ?? "–",
        quantidadeTotal: 0,
        proximaValidade: null,
      };
      mapa.set(m.saborId, grupo);
    }

    grupo.quantidadeTotal += m.quantidadeMovimentada;

    if (m.quantidadeMovimentada > 0 && m.validadeDias > 0 && m.dataCriacao) {
      const criacao = new Date(m.dataCriacao);
      const expiracao = new Date(criacao.getTime() + m.validadeDias * 24 * 60 * 60 * 1000);
      const hoje = new Date();
      if (expiracao >= hoje) {
        if (!grupo.proximaValidade || expiracao < new Date(grupo.proximaValidade)) {
          grupo.proximaValidade = expiracao.toISOString();
        }
      }
    }
  }

  return Array.from(mapa.values()).map((g) => ({
    ...g,
    proximaValidade: g.proximaValidade ? formatarData(g.proximaValidade) : null,
  }));
}

export default function Estoque() {
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [modalAberto, { open, close }] = useDisclosure(false);

  const carregar = useCallback(async () => {
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
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const produtos = useMemo(() => agruparPorProduto(estoque, sabores), [estoque, sabores]);

  async function salvar(data: { saborId: number; quantidadeMovimentada: number; validadeDias: number }) {
    await estoqueApi.criar(data);
    close();
    carregar();
  }

  const rows = produtos.map((p) => (
    <Table.Tr key={p.saborId}>
      <Table.Td>{p.saborId}</Table.Td>
      <Table.Td>{p.saborNome}</Table.Td>
      <Table.Td>
        <Badge color={p.quantidadeTotal > 0 ? "green" : "red"} variant="light">
          {p.quantidadeTotal}
        </Badge>
      </Table.Td>
      <Table.Td>
        {p.proximaValidade ? (
          <Badge color="yellow" variant="light">
            {p.proximaValidade}
          </Badge>
        ) : (
          <Text c="dimmed">—</Text>
        )}
      </Table.Td>
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
                <Table.Th>Produto</Table.Th>
                <Table.Th>Qtd. em Estoque</Table.Th>
                <Table.Th>Próxima Validade</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed" py="md">Nenhum produto no estoque</Text>
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
