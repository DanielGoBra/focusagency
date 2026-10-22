import { useEffect, useState } from "react";
import { Download, Plus, Receipt } from "lucide-react";
import {
  can,
  EXPENSE_CATEGORIES,
  expensesCsv,
  formatDay,
  formatMoney,
  dayKey,
  paymentLabel,
  PAYMENT_METHODS,
  periodRange,
  PERIODS,
  type PaymentMethod,
  type Period,
} from "@negocios/core";
import { useBusiness } from "../lib/app-state";
import { repo } from "../lib/repo";
import { useAsync } from "../lib/use-async";
import { downloadText, slug } from "../lib/download";
import { MoneyInput } from "../components/MoneyInput";
import { Badge, Button, Card, cx, Empty, ErrorNote, Field, Input, Segmented, Sheet, Skeleton } from "../components/ui";

export function Expenses() {
  const { business, period, setPeriod, version } = useBusiness();
  const expenses = useAsync(() => repo.listExpenses(business.id, periodRange(period)), [business.id, period, version]);
  const [open, setOpen] = useState(false);
  const money = (value: number) => formatMoney(value, business.currency);
  const total = (expenses.data ?? []).reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    document.title = `Gastos · ${business.name}`;
  }, [business.name]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Gastos</h1>
          <p className="mt-1 text-ink-3 tabular-nums">{expenses.data ? `${expenses.data.length} gastos · ${money(total)}` : "Cargando…"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented<Period> label="Periodo" value={period} onChange={setPeriod} options={PERIODS} />
          {can(business.role, "exportReports") ? (
            <Button
              icon={<Download size={18} />}
              disabled={!expenses.data?.length}
              onClick={() => downloadText(`gastos-${slug(business.name)}-${period}.csv`, expensesCsv(expenses.data ?? []))}
            >
              Descargar
            </Button>
          ) : null}
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setOpen(true)}>
            Nuevo gasto
          </Button>
        </div>
      </div>

      {expenses.error ? <ErrorNote message={expenses.error} onRetry={expenses.reload} /> : null}

      {!expenses.data ? (
        <Skeleton className="h-64" />
      ) : expenses.data.length === 0 ? (
        <Card>
          <Empty icon={<Receipt size={22} />} title="Sin gastos en este periodo">
            Anota arriendo, servicios y compras para saber cuánto ganas de verdad.
          </Empty>
        </Card>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {expenses.data.map((expense) => (
              <li key={expense.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{expense.category}</p>
                  <p className="truncate text-sm text-ink-3 first-letter:uppercase">
                    {formatDay(dayKey(expense.spentAt))}
                    {expense.note ? ` · ${expense.note}` : ""}
                  </p>
                </div>
                <Badge>{paymentLabel(expense.paymentMethod)}</Badge>
                <span className="w-28 text-right font-semibold tabular-nums">{money(expense.amount)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <NewExpenseSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function NewExpenseSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [round, setRound] = useState(0);
  const close = () => {
    onClose();
    setRound((value) => value + 1);
  };
  return (
    <Sheet open={open} onClose={close} title="Nuevo gasto">
      <ExpenseForm key={round} onDone={close} />
    </Sheet>
  );
}

function ExpenseForm({ onDone }: { onDone: () => void }) {
  const { business, changed, toast } = useBusiness();
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("Mercancía");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!amount || amount <= 0) {
      setError("Escribe cuánto gastaste.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await repo.createExpense(business.id, { amount, category, paymentMethod: method, supplierId: null, note: note.trim() || null });
      toast(`Gasto registrado: ${formatMoney(amount, business.currency)}`);
      changed();
      onDone();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos guardar el gasto.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Field label="¿Cuánto gastaste?">{(id) => <MoneyInput id={id} large autoFocus value={amount} onChange={setAmount} currency={business.currency} />}</Field>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink-2">Categoría</legend>
        <div className="flex flex-wrap gap-2">
          {EXPENSE_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={cx(
                "min-h-9 rounded-full border px-3.5 text-sm font-medium",
                category === item ? "border-brand bg-brand-soft text-brand" : "border-line text-ink-2 hover:bg-surface-2",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink-2">¿Cómo pagaste?</p>
        <Segmented<PaymentMethod> label="Medio de pago" value={method} onChange={setMethod} options={PAYMENT_METHODS} />
      </div>
      <Field label="Nota (opcional)">{(id) => <Input id={id} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ej.: factura 1234" />}</Field>
      {error ? <ErrorNote message={error} /> : null}
      <Button variant="primary" size="lg" className="w-full" disabled={saving} onClick={() => void save()}>
        {saving ? "Guardando…" : "Registrar gasto"}
      </Button>
    </div>
  );
}
