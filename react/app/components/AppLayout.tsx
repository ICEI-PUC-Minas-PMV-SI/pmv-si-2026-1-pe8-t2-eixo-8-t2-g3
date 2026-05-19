import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Group,
  Text,
  NavLink,
  ScrollArea,
  Box,
  rem,
} from "@mantine/core";
import { Link, useLocation } from "react-router";

const navItems = [
  { label: "Início", to: "/" },
  { label: "Pedidos", to: "/pedidos" },
  { label: "Clientes", to: "/clientes" },
  { label: "Sabores", to: "/sabores" },
  { label: "Estoque", to: "/estoque" },
  { label: "Status", to: "/status" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 220, breakpoint: "sm" }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md" gap="sm">
          <Box
            style={{
              width: rem(32),
              height: rem(32),
              borderRadius: rem(8),
              background: "var(--mantine-color-brand-6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text c="white" fw={700} size="sm">
              DN
            </Text>
          </Box>
          <Text fw={700} size="lg" c="brand.9">
            Desejo Natural
          </Text>
        </Group>
      </AppShellHeader>

      <AppShellNavbar p="xs">
        <ScrollArea>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              component={Link}
              to={item.to}
              label={item.label}
              active={location.pathname === item.to}
              variant="filled"
              styles={{ root: { borderRadius: rem(8), marginBottom: rem(2) } }}
            />
          ))}
        </ScrollArea>
      </AppShellNavbar>

      <AppShellMain bg="gray.0">{children}</AppShellMain>
    </AppShell>
  );
}
