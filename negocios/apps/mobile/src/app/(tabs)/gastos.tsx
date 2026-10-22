import { useState } from "react";
import { Text, View } from "react-native";
import {
  dayKey,
  EXPENSE_CATEGORIES,
  formatDay,
  formatMoney,
  parseAmount,
  PAYMENT_METHODS,
  periodRange,
  type PaymentMethod,
} from "@negocios/core";
import { useBusiness, useLoad } from "../../lib/app-state";
import { repo } from "../../lib/repo";
import { space, useColors } from "../../lib/theme";
import { Button, Card, Chips, ErrorNote, Input, Label, Muted, Row, Screen } from "../../components/ui";

export default function Gastos() {
  const c = useColors();
  const { business, version, changed } = useBusiness();
  const [amountText, setAmountText] = useState("");
  const [category, setCategory] = useState<string>("Mercancía");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const expenses = useLoad(() => repo.listExpenses(business.id, periodRange("month")), [business.id, version]);
  const money = (value: number) => formatMoney(value, business.currency);

  async function save() {
    const amount = parseAmount(amountText);
    if (!amount || amount <= 0) return setError("Escribe cuánto gastaste.");
    setSaving(true);
    setError(null);
    try {
      await repo.createExpense(business.id, { amount, category, paymentMethod: method, supplierId: null, note: null });
      setAmountText("");
      changed();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos guardar el gasto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen title="Gastos" subtitle={business.name} refreshing={expenses.loading && Boolean(expenses.data)} onRefresh={expenses.reload}>
      <Card style={{ gap: space(3) }}>
        <Label>¿Cuánto gastaste?</Label>
        <Input large value={amountText} onChangeText={setAmountText} keyboardType="decimal-pad" placeholder="$ 0" accessibilityLabel="Monto del gasto" />
        <Label>Categoría</Label>
        <Chips<string> value={category} onChange={setCategory} options={EXPENSE_CATEGORIES.map((item) => ({ value: item, label: item }))} />
        <Label>¿Cómo pagaste?</Label>
        <Chips<PaymentMethod> value={method} onChange={setMethod} options={PAYMENT_METHODS} />
        {error ? <ErrorNote message={error} /> : null}
        <Button title="Registrar gasto" onPress={() => void save()} loading={saving} />
      </Card>

      <Label style={{ color: c.ink, fontSize: 17, fontWeight: "600" }}>Este mes</Label>
      {expenses.error ? <ErrorNote message={expenses.error} /> : null}
      <Card style={{ padding: 0, gap: 0 }}>
        {(expenses.data ?? []).map((expense, index) => (
          <Row key={expense.id} style={{ paddingHorizontal: space(4), paddingVertical: space(3), borderTopWidth: index ? 1 : 0, borderTopColor: c.border }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "500", color: c.ink }}>{expense.category}</Text>
              <Muted>{formatDay(dayKey(expense.spentAt))}</Muted>
            </View>
            <Text style={{ fontSize: 16, fontWeight: "600", color: c.ink, fontVariant: ["tabular-nums"] }}>{money(expense.amount)}</Text>
          </Row>
        ))}
        {expenses.data && !expenses.data.length ? (
          <View style={{ padding: space(4) }}>
            <Muted>Sin gastos este mes.</Muted>
          </View>
        ) : null}
      </Card>
    </Screen>
  );
}
