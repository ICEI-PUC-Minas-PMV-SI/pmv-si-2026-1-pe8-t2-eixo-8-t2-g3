import { useCallback, useEffect, useState } from "react";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Button,
  Group,
  NavLink,
  Notification,
  ScrollArea,
  Tooltip,
  rem,
} from "@mantine/core";
import { Link, useLocation } from "react-router";

declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      saveDatabaseBackup: () => Promise<{ success: boolean; error?: string }>;
    };
  }
}

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
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    color: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleBackup = useCallback(async () => {
    setLoading(true);
    try {
      if (window.electronAPI?.saveDatabaseBackup) {
        const result = await window.electronAPI.saveDatabaseBackup();
        if (result.success) {
          setNotification({
            color: "green",
            message: "Backup realizado com sucesso!",
          });
        } else if (result.error !== "Operacao cancelada") {
          setNotification({ color: "red", message: result.error || "Erro desconhecido" });
        }
      } else {
        const dateStr = new Date().toISOString().slice(0, 10);
        const a = document.createElement("a");
        a.href = "/api/backup/download";
        a.download = `desejonatural-backup-${dateStr}.db`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setNotification({
          color: "green",
          message: "Download do backup iniciado",
        });
      }
    } catch (err) {
      setNotification({
        color: "red",
        message: `Erro ao fazer backup: ${err}`,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{ width: 220, breakpoint: "sm" }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md" gap="sm" justify="space-between">
          <img
            src="/desejo-natural-logo.png"
            alt="Desejo Natural"
            style={{ height: "80%" }}
          />
          <Tooltip label="Fazer backup do banco de dados">
            <Button onClick={handleBackup} loading={loading} variant="default">
              Backup
            </Button>
          </Tooltip>
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

      {notification && (
        <Notification
          color={notification.color}
          onClose={() => setNotification(null)}
          style={{
            position: "fixed",
            bottom: rem(20),
            right: rem(20),
            zIndex: 1000,
          }}
        >
          {notification.message}
        </Notification>
      )}
    </AppShell>
  );
}
