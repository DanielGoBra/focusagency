import { useEffect } from "react";
import { Download, Plus, ShoppingBag } from "lucide-react";
import {
  can,
  dayKey,
  formatDay,
  formatMoney,
  formatTime,
  paymentLabel,
  periodRange,
  PERIODS,
  salesCsv,
  type Period,
  type Sale,
} from "@negocios/core";
import { useBusiness } from "../lib/app-state";
import { repo } from "../lib/repo";
import { useAsync } from "../lib/use-async";
import { downloadText, slug } from "../lib/download";
import { useShell } from "../components/AppShell";
import { Badge, Button, Card, Empty, ErrorNote, Segmented, Skeleton } from "../components/ui";

export function Sales() {
  const { business, period, setPeriod, version } = useBusiness();
  const { openSale } = useShell();
  const sales = useAsync(() => repo.listSales(business.id, periodRange(period)), [business.id, period, version]);
  const money = (value: number) => formatMoney(value, business.currency);

  useEffect(() => {
    document.title = `Ventas · ${business.name}`;
  }, [business.name]);

  const groups = groupByDay(sales.data ?? []);
  const total = (sales.data ?? []).reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Ventas</h1>
          <p className="mt-1 text-ink-3 tabular-nums">
            {sales.data ? `${sales.data.length} ventas · ${money(total)}` : "Cargando…"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented<Period> label="Periodo" value={period} onChange={setPeriod} options={PERIODS} />
          {can(business.role, "exportReports") ? (
            <Button
              icon={<Download size={18} />}
              disabled={!sales.data?.length}
              onClick={() => downloadText(`ventas-${slug(business.name)}-${period}.csv`, salesCsv(sales.data ?? []))}
            >
              Descargar
            </Button>
          ) : null}
        </div>
      </div>

      {sales.error ? <ErrorNote message={sales.error} onRetry={sales.reload} /> : null}

      {!sales.data ? (
        <Skeleton className="h-64" />
      ) : groups.length === 0 ? (
        <Card>
          <Empty icon={<ShoppingBag size={22} />} title="Sin ventas en este periodo">
            <Button variant="primary" icon={<Plus size={18} />} onClick={openSale} className="mt-2">
              Registrar venta
            </Button>
          </Empty>
        </Card>
      ) : (
        groups.map(([key, items]) => (
          <section key={key} aria-labelledby={`dia-${key}`}>
            <div className="mb-2 flex items-baseline justify-between px-1">
              <h2 id={`dia-${key}`} className="text-sm font-semibold text-ink-2 first-letter:uppercase">
                {formatDay(key)}
              </h2>
              <span className="text-sm text-ink-3 tabular-nums">{money(items.reduce((sum, sale) => sum + sale.total, 0))}</span>
            </div>
            <Card className="p-0">
              <ul className="divide-y divide-line">
                {items.map((sale) => (
                  <li key={sale.id} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="w-16 shrink-0 text-sm text-ink-3 tabular-nums">{formatTime(sale.soldAt)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {sale.items.map((item) => (item.quantity === 1 ? item.description : `${formatQty(item.quantity)} × ${item.description}`)).join(", ")}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Badge tone={sale.status === "credit" ? "warning" : "neutral"}>
                          {sale.status === "credit" ? `Fiado · ${sale.customerName ?? ""}` : paymentLabel(sale.paymentMethod)}
                        </Badge>
                        {sale.discount ? <Badge>Descuento {money(sale.discount)}</Badge> : null}
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums">{money(sale.total)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        ))
      )}
    </div>
  );
}

function groupByDay(sales: Sale[]): [string, Sale[]][] {
  const map = new Map<string, Sale[]>();
  for (const sale of sales) {
    const key = dayKey(sale.soldAt);
    map.set(key, [...(map.get(key) ?? []), sale]);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

const formatQty = (value: number) => new Intl.NumberFormat("es-CO", { maximumFractionDigits: 3 }).format(value);
