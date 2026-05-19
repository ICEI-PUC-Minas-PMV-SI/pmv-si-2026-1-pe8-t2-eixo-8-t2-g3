import {
  SimpleGrid,
  Card,
  Text,
  Title,
  Group,
  ThemeIcon,
  Stack,
  Box,
  rem,
} from "@mantine/core";
import { Link } from "react-router";
import { AppLayout } from "../components/AppLayout";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Desejo Natural" },
    { name: "description", content: "Sistema de gestão Desejo Natural" },
  ];
}

const modules = [
  {
    label: "Pedidos",
    description: "Criar, acompanhar, finalizar e cancelar pedidos",
    to: "/pedidos",
    icon: "🛒",
  },
  {
    label: "Clientes",
    description: "Cadastro e gerenciamento de clientes",
    to: "/clientes",
    icon: "👤",
  },
  {
    label: "Sabores",
    description: "Catálogo de sabores disponíveis",
    to: "/sabores",
    icon: "🍦",
  },
  {
    label: "Estoque",
    description: "Movimentação e controle de estoque",
    to: "/estoque",
    icon: "📦",
  },
  {
    label: "Status",
    description: "Gerenciamento dos status de pedido",
    to: "/status",
    icon: "🏷️",
  },
  {
    label: "Dashboards",
    description: "Visualização de dados e métricas",
    to: "/dashboards",
    icon: "📊",
  },
];

export default function Home() {
  return (
    <AppLayout>
      <Stack gap="xl" p="md">
        <Box>
          <Title order={2} c="brand.9">
            Painel de Controle
          </Title>
          <Text c="dimmed" mt={4}>
            Selecione um módulo para começar
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {modules.map((mod) => (
            <Card
              key={mod.to}
              component={Link}
              to={mod.to}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              <Group gap="md">
                <ThemeIcon size={48} radius="md" color="brand" variant="filled">
                  <span style={{ fontSize: rem(22) }}>{mod.icon}</span>
                </ThemeIcon>
                <Box>
                  <Text fw={600} size="lg" c="brand.9">
                    {mod.label}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {mod.description}
                  </Text>
                </Box>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </AppLayout>
  );
}
