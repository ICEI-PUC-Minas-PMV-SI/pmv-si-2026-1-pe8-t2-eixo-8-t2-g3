import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Group,
  NavLink,
  ScrollArea,
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
  { label: "Dashboards", to: "/dashboards" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{ width: 220, breakpoint: "sm" }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md" gap="sm">
          <img
            src="/desejo-natural-logo.png"
            alt="Desejo Natural"
            style={{ height: "80%" }}
          />
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
