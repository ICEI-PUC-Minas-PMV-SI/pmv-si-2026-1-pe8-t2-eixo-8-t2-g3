import { useState } from "react";
import { Stack, TextInput, Alert, Group, Button } from "@mantine/core";

interface NomeFormProps {
  inicial?: string;
  label?: string;
  onSalvar: (nome: string) => Promise<void>;
  onCancelar: () => void;
  submitLabel?: string;
}

export function NomeForm({
  inicial = "",
  label = "Nome",
  onSalvar,
  onCancelar,
  submitLabel = "Salvar",
}: NomeFormProps) {
  const [nome, setNome] = useState(inicial);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return setErro(`${label} é obrigatório`);
    setLoading(true);
    setErro("");
    try {
      await onSalvar(nome.trim());
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
          label={label}
          value={nome}
          onChange={(e) => setNome(e.currentTarget.value)}
          required
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancelar}>Cancelar</Button>
          <Button type="submit" color="brand" loading={loading}>{submitLabel}</Button>
        </Group>
      </Stack>
    </form>
  );
}
