import { useState, type FormEvent } from "react";
import { repo } from "../lib/repo";
import { Button, ErrorNote, Field, Input } from "../components/ui";

export function Login() {
  const demo = repo.mode === "demo";
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState(demo ? "demo@negocios.app" : "");
  const [password, setPassword] = useState(demo ? "demo1234" : "");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signIn") await repo.signIn(email.trim(), password);
      else {
        const { needsConfirmation } = await repo.signUp(email.trim(), password);
        if (needsConfirmation) setNotice("Te enviamos un correo para confirmar la cuenta. Ábrelo y vuelve a entrar.");
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos entrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="size-10" />
          <div>
            <h1 className="text-2xl font-semibold">Negocios</h1>
            <p className="text-sm text-ink-3">Ventas, gastos, inventario y fiados en un solo lugar.</p>
          </div>
        </div>

        <form onSubmit={(event) => void submit(event)} className="space-y-4 rounded-3xl border border-line bg-surface p-6 shadow-card">
          <h2 className="text-lg font-semibold">{mode === "signIn" ? "Entra a tu cuenta" : "Crea tu cuenta"}</h2>
          {demo ? (
            <p className="rounded-xl bg-brand-soft px-3.5 py-2.5 text-sm text-brand">
              Modo demostración: entra con cualquier correo y verás una tienda de ejemplo.
            </p>
          ) : null}
          <Field label="Correo">
            {(id) => <Input id={id} type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />}
          </Field>
          <Field label="Contraseña" hint="Mínimo 8 caracteres.">
            {(id) => (
              <Input
                id={id}
                type="password"
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            )}
          </Field>
          {error ? <ErrorNote message={error} /> : null}
          {notice ? <p className="rounded-xl bg-surface-2 px-3.5 py-2.5 text-sm">{notice}</p> : null}
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
            {busy ? "Un momento…" : mode === "signIn" ? "Entrar" : "Crear cuenta"}
          </Button>
          <p className="text-center text-sm text-ink-3">
            {mode === "signIn" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button type="button" className="font-semibold text-brand" onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}>
              {mode === "signIn" ? "Créala gratis" : "Entra"}
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}
