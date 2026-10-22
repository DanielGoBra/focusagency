import { useState, type FormEvent } from "react";
import { useApp } from "../lib/app-state";
import { repo } from "../lib/repo";
import { Button, ErrorNote, Field, Input, Select } from "../components/ui";

const COUNTRIES = [
  { country: "CO", currency: "COP", label: "Colombia (COP)" },
  { country: "MX", currency: "MXN", label: "México (MXN)" },
  { country: "PE", currency: "PEN", label: "Perú (PEN)" },
  { country: "CL", currency: "CLP", label: "Chile (CLP)" },
  { country: "EC", currency: "USD", label: "Ecuador (USD)" },
];

export function Onboarding() {
  const { reloadBusinesses, selectBusiness } = useApp();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("CO");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const choice = COUNTRIES.find((item) => item.country === country) ?? COUNTRIES[0]!;
    setBusy(true);
    setError(null);
    try {
      const business = await repo.createBusiness({
        name: name.trim(),
        country: choice.country,
        currency: choice.currency,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      selectBusiness(business.id);
      await reloadBusinesses();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos crear el negocio.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <form onSubmit={(event) => void submit(event)} className="w-full max-w-sm space-y-5 rounded-3xl border border-line bg-surface p-6 shadow-card">
        <div>
          <h1 className="text-xl font-semibold">Cuéntanos de tu negocio</h1>
          <p className="mt-1 text-sm text-ink-3">Podrás agregar más negocios y a tu equipo después.</p>
        </div>
        <Field label="Nombre del negocio">
          {(id) => <Input id={id} required autoFocus maxLength={120} placeholder="Ej.: Tienda La Esquina" value={name} onChange={(event) => setName(event.target.value)} />}
        </Field>
        <Field label="País y moneda">
          {(id) => (
            <Select id={id} value={country} onChange={(event) => setCountry(event.target.value)}>
              {COUNTRIES.map((item) => (
                <option key={item.country} value={item.country}>
                  {item.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        {error ? <ErrorNote message={error} /> : null}
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy || !name.trim()}>
          {busy ? "Creando…" : "Empezar"}
        </Button>
      </form>
    </main>
  );
}
