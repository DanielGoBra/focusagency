import { View } from "react-native";
import {
  can,
  formatMoney,
  formatQuantity,
  lowStock,
  paymentLabel,
  periodRange,
  PERIODS,
  summarize,
  type PaymentMethod,
  type Period,
} from "@negocios/core";
import { useBusiness, useLoad } from "../../lib/app-state";
import { repo } from "../../lib/repo";
import { space, useColors } from "../../lib/theme";
import { Amount, Card, Chips, ErrorNote, Label, Muted, Row, Screen } from "../../components/ui";

const PERIOD_NOUN: Record<Period, string> = { today: "hoy", week: "esta semana", month: "este mes" };

export default function Inicio() {
  const c = useColors();
  const { business, period, setPeriod, version } = useBusiness();
  const money = (value: number) => formatMoney(value, business.currency);

  const state = useLoad(async () => {
    const range = periodRange(period);
    const [sales, expenses, payments, debts, products] = await Promise.all([
      repo.listSales(business.id, range),
      repo.listExpenses(business.id, range),
      repo.listDebtPayments(business.id, range),
      repo.listOpenDebts(business.id),
      repo.listProducts(business.id),
    ]);
    return { summary: summarize({ sales, expenses, debtPayments: payments }), debts, low: lowStock(products) };
  }, [business.id, period, version]);

  const s = state.data?.summary;
  const receivable = state.data?.debts.reduce((sum, debt) => sum + debt.balance, 0) ?? 0;
  const methods = s ? (Object.entries(s.collectedByMethod) as [PaymentMethod, number][]).filter(([, value]) => value > 0) : [];

  return (
    <Screen title="Inicio" subtitle={business.name} refreshing={state.loading && Boolean(state.data)} onRefresh={state.reload}>
      <Chips<Period> value={period} onChange={setPeriod} options={PERIODS} />
      {state.error ? <ErrorNote message={state.error} /> : null}

      <Card>
        <Label>Ventas de {PERIOD_NOUN[period]}</Label>
        <Amount size={40}>{s ? money(s.salesTotal) : "—"}</Amount>
        <Muted>{s ? `${s.salesCount} ventas · ticket promedio ${money(s.averageTicket)}` : "Cargando…"}</Muted>
      </Card>

      <View style={{ flexDirection: "row", gap: space(3) }}>
        {can(business.role, "viewProfit") ? (
          <Card style={{ flex: 1 }}>
            <Label>Ganancia</Label>
            <Amount tone={s && s.profit < 0 ? "danger" : undefined}>{s ? money(s.profit) : "—"}</Amount>
          </Card>
        ) : null}
        <Card style={{ flex: 1 }}>
          <Label>Por cobrar</Label>
          <Amount>{state.data ? money(receivable) : "—"}</Amount>
        </Card>
      </View>

      <Card>
        <Label style={{ color: c.ink, fontSize: 16, fontWeight: "600", marginBottom: space(1) }}>Cómo te pagaron</Label>
        {methods.length && s ? (
          methods.map(([method, value]) => (
            <View key={method} style={{ gap: space(1.5), marginBottom: space(2) }}>
              <Row>
                <Muted style={{ color: c.ink, fontSize: 15 }}>{paymentLabel(method)}</Muted>
                <Muted style={{ color: c.ink, fontSize: 15, fontWeight: "600" }}>{money(value)}</Muted>
              </Row>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: c.surface2 }}>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: c.chart, width: `${(value / s.collected) * 100}%` }} />
              </View>
            </View>
          ))
        ) : (
          <Muted>Aún no entra dinero en este periodo.</Muted>
        )}
      </Card>

      {state.data?.low.length ? (
        <Card>
          <Label style={{ color: c.ink, fontSize: 16, fontWeight: "600" }}>Por agotarse</Label>
          {state.data.low.slice(0, 5).map((product) => (
            <Row key={product.id}>
              <Muted style={{ color: c.ink, fontSize: 15, flexShrink: 1 }}>{product.name}</Muted>
              <Muted style={{ color: c.warning, fontWeight: "600" }}>Quedan {formatQuantity(product.stock, product.unit)}</Muted>
            </Row>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}
