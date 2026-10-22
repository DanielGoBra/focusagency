import { useEffect } from "react";
import { Link } from "react-router";
import { AlertTriangle, ArrowRight, HandCoins, Package, ShoppingBag } from "lucide-react";
import {
  can,
  dayKey,
  formatMoney,
  formatQuantity,
  lowStock,
  paymentLabel,
  periodRange,
  PERIODS,
  summarize,
  type PaymentMethod,
  type Period,
  type Range,
  type Sale,
} from "@negocios/core";
import { useBusiness } from "../lib/app-state";
import { repo } from "../lib/repo";
import { useAsync } from "../lib/use-async";
import { SalesChart, type ChartPoint } from "../components/SalesChart";
import { Badge, Button, Card, CardTitle, Empty, ErrorNote, Segmented, Skeleton } from "../components/ui";
import { useShell } from "../components/AppShell";

const PERIOD_NOUN: Record<Period, string> = { today: "hoy", week: "esta semana", month: "este mes" };

export function Dashboard() {
  const { business, period, setPeriod, version } = useBusiness();
  const { openSale } = useShell();
  const range = periodRange(period);
  const showProfit = can(business.role, "viewProfit");

  useEffect(() => {
    document.title = `Inicio · ${business.name}`;
  }, [business.name]);

  const state = useAsync(async () => {
    const [sales, expenses, payments, debts, products] = await Promise.all([
      repo.listSales(business.id, range),
      repo.listExpenses(business.id, range),
      repo.listDebtPayments(business.id, range),
      repo.listOpenDebts(business.id),
      repo.listProducts(business.id),
    ]);
    return { sales, debts, products, summary: summarize({ sales, expenses, debtPayments: payments }) };
  }, [business.id, period, version]);

  const money = (value: number) => formatMoney(value, business.currency);
  const data = state.data;
  const receivable = data?.debts.reduce((sum, debt) => sum + debt.balance, 0) ?? 0;
  const low = data ? lowStock(data.products) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-3 first-letter:uppercase">
            {new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Inicio</h1>
        </div>
        <Segmented<Period> label="Periodo" value={period} onChange={setPeriod} options={PERIODS} />
      </div>

      {state.error ? <ErrorNote message={state.error} onRetry={state.reload} /> : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="col-span-2">
          <p className="text-sm font-medium text-ink-2">Ventas de {PERIOD_NOUN[period]}</p>
          {data ? (
            <>
              <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums">{money(data.summary.salesTotal)}</p>
              <p className="mt-2 text-sm text-ink-3">
                {data.summary.salesCount} {data.summary.salesCount === 1 ? "venta" : "ventas"} · ticket promedio {money(data.summary.averageTicket)}
                {data.summary.soldOnCredit ? ` · ${money(data.summary.soldOnCredit)} fiado` : ""}
              </p>
            </>
          ) : (
            <Skeleton className="mt-3 h-14 w-56" />
          )}
        </Card>
        {showProfit ? (
          <Stat
            label="Ganancia"
            value={data ? money(data.summary.profit) : null}
            hint="Ventas menos costo y gastos"
            tone={data && data.summary.profit < 0 ? "danger" : undefined}
          />
        ) : null}
        {showProfit ? <Stat label="Gastos" value={data ? money(data.summary.expensesTotal) : null} hint="Incluye compras de mercancía" /> : null}
        <Stat label="Por cobrar" value={data ? money(receivable) : null} hint={`${data?.debts.length ?? 0} fiados abiertos`} />
        <Stat label="Dinero que entró" value={data ? money(data.summary.collected) : null} hint="Ventas pagadas + abonos" />
      </div>

      <Card>
        <CardTitle>{period === "today" ? "Ventas por hora" : "Ventas por día"}</CardTitle>
        {data ? (
          data.summary.salesCount ? (
            <SalesChart points={chartPoints(data.sales, period, range)} currency={business.currency} title={`Ventas de ${PERIOD_NOUN[period]}`} />
          ) : (
            <Empty icon={<ShoppingBag size={22} />} title="Todavía no hay ventas">
              <p className="mb-3">Registra la primera y aquí verás cómo va el día.</p>
              <Button variant="primary" onClick={openSale}>
                Registrar venta
              </Button>
            </Empty>
          )
        ) : (
          <Skeleton className="h-52 w-full" />
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Cómo te pagaron</CardTitle>
          {data ? <MethodBreakdown byMethod={data.summary.collectedByMethod} total={data.summary.collected} money={money} /> : <Skeleton className="h-32" />}
        </Card>
        <Card>
          <CardTitle>Lo más vendido</CardTitle>
          {data?.summary.topProducts.length ? (
            <ol className="space-y-3">
              {data.summary.topProducts.map((product, index) => (
                <li key={product.key} className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-lg bg-surface-2 text-xs font-semibold text-ink-2">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{product.description}</span>
                  <span className="text-sm text-ink-3 tabular-nums">{new Intl.NumberFormat("es-CO", { maximumFractionDigits: 3 }).format(product.quantity)}</span>
                  <span className="w-24 text-right font-medium tabular-nums">{money(product.total)}</span>
                </li>
              ))}
            </ol>
          ) : data ? (
            <p className="text-sm text-ink-3">Las ventas con productos del inventario aparecen aquí.</p>
          ) : (
            <Skeleton className="h-32" />
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle
            action={
              <Link to="/inventario" className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
                Inventario <ArrowRight size={16} aria-hidden />
              </Link>
            }
          >
            Por agotarse
          </CardTitle>
          {low.length ? (
            <ul className="space-y-3">
              {low.slice(0, 5).map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <AlertTriangle size={16} className="shrink-0 text-warning" aria-hidden />
                    <span className="truncate">{product.name}</span>
                  </span>
                  <Badge tone={product.stock <= 0 ? "danger" : "warning"}>
                    Quedan {formatQuantity(product.stock, product.unit)} · mín. {formatQuantity(product.minStock, product.unit)}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <Empty icon={<Package size={22} />} title="Todo en orden">
              Ningún producto está por debajo de su mínimo.
            </Empty>
          )}
        </Card>
        <Card>
          <CardTitle
            action={
              <Link to="/fiados" className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
                Fiados <ArrowRight size={16} aria-hidden />
              </Link>
            }
          >
            Quién te debe
          </CardTitle>
          {data?.debts.length ? (
            <ul className="space-y-3">
              {[...data.debts]
                .sort((a, b) => b.balance - a.balance)
                .slice(0, 5)
                .map((debt) => (
                  <li key={debt.id} className="flex items-center justify-between gap-3">
                    <span className="truncate">{debt.contactName}</span>
                    <span className="font-medium tabular-nums">{money(debt.balance)}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <Empty icon={<HandCoins size={22} />} title="Nadie te debe">
              Cuando fíes una venta, el saldo aparece aquí.
            </Empty>
          )}
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, hint, tone }: { label: string; value: string | null; hint: string; tone?: "danger" }) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-sm font-medium text-ink-2">{label}</p>
      {value === null ? (
        <Skeleton className="mt-3 h-8 w-28" />
      ) : (
        <p className={`mt-2 text-xl font-semibold tabular-nums sm:text-2xl ${tone === "danger" ? "text-danger" : ""}`}>{value}</p>
      )}
      <p className="mt-1 text-xs text-ink-3">{hint}</p>
    </Card>
  );
}

function MethodBreakdown({ byMethod, total, money }: { byMethod: Record<PaymentMethod, number>; total: number; money: (value: number) => string }) {
  const rows = (Object.entries(byMethod) as [PaymentMethod, number][]).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]);
  if (!rows.length) return <p className="text-sm text-ink-3">Aún no entra dinero en este periodo.</p>;
  return (
    <ul className="space-y-3.5">
      {rows.map(([method, value]) => (
        <li key={method}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span>{paymentLabel(method)}</span>
            <span className="font-medium tabular-nums">
              {money(value)} <span className="text-ink-3">· {Math.round((value / total) * 100)} %</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-2">
            <div className="h-2 rounded-full bg-chart" style={{ width: `${(value / total) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function chartPoints(sales: Sale[], period: Period, range: Range): ChartPoint[] {
  if (period === "today") {
    const hours = Array.from({ length: 15 }, (_, index) => index + 6);
    return hours.map((hour) => ({
      key: String(hour),
      label: `${hour}h`,
      detail: `${hour}:00 a ${hour + 1}:00`,
      value: sales.filter((sale) => new Date(sale.soldAt).getHours() === hour).reduce((sum, sale) => sum + sale.total, 0),
    }));
  }

  const totals = new Map<string, number>();
  for (const sale of sales) {
    const key = dayKey(sale.soldAt);
    totals.set(key, (totals.get(key) ?? 0) + sale.total);
  }
  const points: ChartPoint[] = [];
  const weekday = new Intl.DateTimeFormat("es-CO", { weekday: "short" });
  const full = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" });
  for (let day = new Date(range.from); day < range.to; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
    const key = dayKey(day.toISOString());
    points.push({
      key,
      label: period === "week" ? weekday.format(day).replace(".", "") : String(day.getDate()),
      detail: full.format(day),
      value: totals.get(key) ?? 0,
    });
  }
  return points;
}
