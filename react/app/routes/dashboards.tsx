import { useEffect, useState } from "react";
import {
  Title,
  Card,
  Group,
  Stack,
  Text,
  SimpleGrid,
  LoadingOverlay,
  Alert,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { AppLayout } from "../components/AppLayout";
import { dashboardsApi } from "../lib/api";

export function meta() {
  return [{ title: "Dashboards – Desejo Natural" }];
}

export default function Dashboards() {
  const [totalClientes, setTotalClientes] = useState<number | null>(null);
  const [totalProdutos, setTotalProdutos] = useState<number | null>(null);
  const [vendas, setVendas] = useState<{ periodo: string; valorTotal: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setErro("");
    setLoading(true);
    try {
      const [c, p, v] = await Promise.all([
        dashboardsApi.totalDeClientesAtivos(),
        dashboardsApi.produtosEmEstoque(),
        dashboardsApi.vendasPorMes(),
      ]);
      setTotalClientes(c.totalClientesAtivos);
      setTotalProdutos(p.totalProdutosEstoque);
      setVendas(v);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  const maiorValor = Math.max(...vendas.map((v) => v.valorTotal), 1);

  return (
    <AppLayout>
      <Stack p="md" gap="lg">
        <Title order={2} c="brand.9">Dashboards</Title>

        {erro && <Alert color="red">{erro}</Alert>}

        <Box pos="relative">
          <LoadingOverlay visible={loading} />

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group gap="md">
                <ThemeIcon size={48} radius="md" color="brand" variant="filled">
                  <span style={{ fontSize: 22 }}>👤</span>
                </ThemeIcon>
                <Box>
                  <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                    Clientes Ativos
                  </Text>
                  <Text size="xxl" fw={700} c="brand.9">
                    {totalClientes ?? "—"}
                  </Text>
                </Box>
              </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group gap="md">
                <ThemeIcon size={48} radius="md" color="teal" variant="filled">
                  <span style={{ fontSize: 22 }}>📦</span>
                </ThemeIcon>
                <Box>
                  <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                    Produtos em Estoque
                  </Text>
                  <Text size="xxl" fw={700} c="teal.9">
                    {totalProdutos ?? "—"}
                  </Text>
                </Box>
              </Group>
            </Card>
          </SimpleGrid>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md" c="brand.9">
              Vendas por Período
            </Title>

            {vendas.length === 0 && !loading && (
              <Text ta="center" c="dimmed" py="xl">
                Nenhuma venda registrada
              </Text>
            )}

            <Box
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: 200,
                padding: "0 4px",
              }}
            >
              {vendas.map((v) => (
                <Box
                  key={v.periodo}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text size="xs" fw={600} mb={4}>
                    {v.valorTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                  <Box
                    style={{
                      width: "100%",
                      maxWidth: 60,
                      height: `${Math.max((v.valorTotal / maiorValor) * 100, 4)}%`,
                      backgroundColor: "var(--mantine-color-brand-5)",
                      borderRadius: "var(--mantine-radius-sm) var(--mantine-radius-sm) 0 0",
                      transition: "height 0.3s ease",
                    }}
                  />
                  <Text size="xs" ta="center" mt={4} c="dimmed">
                    {v.periodo}
                  </Text>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      </Stack>
    </AppLayout>
  );
}
