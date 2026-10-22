import { useEffect, useState } from "react";
import { HandCoins, MessageCircle } from "lucide-react";
import {
  dayKey,
  formatDay,
  formatMoney,
  PAYMENT_METHODS,
  reminderMessage,
  whatsappLink,
  type Debt,
  type PaymentMethod,
} from "@negocios/core";
import { useBusiness } from "../lib/app-state";
import { repo } from "../lib/repo";
import { useAsync } from "../lib/use-async";
import { MoneyInput } from "../components/MoneyInput";
import { Button, Card, Empty, ErrorNote, Field, Segmented, Sheet, Skeleton } from "../components/ui";

export function Debts() {
  const { business, version } = useBusiness();
  const debts = useAsync(() => repo.listOpenDebts(business.id), [business.id, version]);
  const [paying, setPaying] = useState<Debt | null>(null);
  const money = (value: number) => formatMoney(value, business.currency);
  const total = (debts.data ?? []).reduce((sum, debt) => sum + debt.balance, 0);

  useEffect(() => {
    document.title = `Fiados · ${business.name}`;
  }, [business.name]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Fiados</h1>
        <p className="mt-1 text-ink-3 tabular-nums">{debts.data ? `${debts.data.length} clientes te deben ${money(total)}` : "Cargando…"}</p>
      </div>

      {debts.error ? <ErrorNote message={debts.error} onRetry={debts.reload} /> : null}

      {!debts.data ? (
        <Skeleton className="h-64" />
      ) : debts.data.length === 0 ? (
        <Card>
          <Empty icon={<HandCoins size={22} />} title="Nadie te debe">
            Cuando registres una venta como fiado, aparece aquí con su saldo.
          </Empty>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...debts.data]
            .sort((a, b) => b.balance - a.balance)
            .map((debt) => {
              const text = reminderMessage({ businessName: business.name, contactName: debt.contactName, balance: debt.balance, currency: business.currency });
              return (
                <Card key={debt.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{debt.contactName}</p>
                      <p className="text-sm text-ink-3 first-letter:uppercase">Desde el {formatDay(dayKey(debt.createdAt))}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold tabular-nums">{money(debt.balance)}</p>
                      {debt.balance < debt.amount ? <p className="text-xs text-ink-3 tabular-nums">de {money(debt.amount)}</p> : null}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="primary" className="flex-1" onClick={() => setPaying(debt)}>
                      Registrar abono
                    </Button>
                    <a
                      href={whatsappLink(text, debt.contactPhone, business.country)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface-2"
                    >
                      <MessageCircle size={18} aria-hidden /> Cobrar
                    </a>
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      <Sheet open={paying !== null} onClose={() => setPaying(null)} title={paying ? `Abono de ${paying.contactName}` : "Abono"}>
        {paying ? <PaymentForm key={paying.id} debt={paying} onDone={() => setPaying(null)} /> : null}
      </Sheet>
    </div>
  );
}

function PaymentForm({ debt, onDone }: { debt: Debt; onDone: () => void }) {
  const { business, changed, toast } = useBusiness();
  const [amount, setAmount] = useState<number | null>(debt.balance);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!amount || amount <= 0) return setError("Escribe el valor del abono.");
    if (amount > debt.balance) return setError(`El saldo es ${formatMoney(debt.balance, business.currency)}.`);
    setSaving(true);
    setError(null);
    try {
      await repo.payDebt(business.id, debt.id, amount, method);
      toast(amount === debt.balance ? `${debt.contactName} quedó a paz y salvo` : `Abono registrado: ${formatMoney(amount, business.currency)}`);
      changed();
      onDone();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos registrar el abono.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-2">
        Saldo actual: <strong className="tabular-nums">{formatMoney(debt.balance, business.currency)}</strong>
      </p>
      <Field label="Valor del abono">{(id) => <MoneyInput id={id} large autoFocus value={amount} onChange={setAmount} currency={business.currency} />}</Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink-2">¿Cómo pagó?</p>
        <Segmented<PaymentMethod> label="Medio de pago" value={method} onChange={setMethod} options={PAYMENT_METHODS} />
      </div>
      {error ? <ErrorNote message={error} /> : null}
      <Button variant="primary" size="lg" className="w-full" disabled={saving} onClick={() => void save()}>
        {saving ? "Guardando…" : "Registrar abono"}
      </Button>
    </div>
  );
}
