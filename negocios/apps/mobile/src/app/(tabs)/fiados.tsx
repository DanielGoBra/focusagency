import { useState } from "react";
import { Linking, Text, View } from "react-native";
import { formatMoney, parseAmount, reminderMessage, whatsappLink, type Debt } from "@negocios/core";
import { useBusiness, useLoad } from "../../lib/app-state";
import { repo } from "../../lib/repo";
import { space, useColors } from "../../lib/theme";
import { Amount, Button, Card, ErrorNote, Input, Muted, Row, Screen } from "../../components/ui";

export default function Fiados() {
  const { business, version } = useBusiness();
  const debts = useLoad(() => repo.listOpenDebts(business.id), [business.id, version]);
  const total = (debts.data ?? []).reduce((sum, debt) => sum + debt.balance, 0);

  return (
    <Screen title="Fiados" subtitle={business.name} refreshing={debts.loading && Boolean(debts.data)} onRefresh={debts.reload}>
      <Muted style={{ fontSize: 15 }}>
        {debts.data ? `${debts.data.length} clientes te deben ${formatMoney(total, business.currency)}` : "Cargando…"}
      </Muted>
      {debts.error ? <ErrorNote message={debts.error} /> : null}
      {[...(debts.data ?? [])]
        .sort((a, b) => b.balance - a.balance)
        .map((debt) => (
          <DebtCard key={debt.id} debt={debt} />
        ))}
    </Screen>
  );
}

function DebtCard({ debt }: { debt: Debt }) {
  const c = useColors();
  const { business, changed } = useBusiness();
  const [paying, setPaying] = useState(false);
  const [text, setText] = useState(String(debt.balance));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const money = (value: number) => formatMoney(value, business.currency);

  async function pay() {
    const amount = parseAmount(text);
    if (!amount || amount <= 0 || amount > debt.balance) return setError(`Escribe un valor entre 1 y ${money(debt.balance)}.`);
    setSaving(true);
    try {
      await repo.payDebt(business.id, debt.id, amount, "cash");
      changed();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos registrar el abono.");
      setSaving(false);
    }
  }

  const reminder = reminderMessage({ businessName: business.name, contactName: debt.contactName, balance: debt.balance, currency: business.currency });

  return (
    <Card style={{ gap: space(3) }}>
      <Row>
        <Text style={{ fontSize: 17, fontWeight: "600", color: c.ink, flexShrink: 1 }}>{debt.contactName}</Text>
        <Amount>{money(debt.balance)}</Amount>
      </Row>
      {paying ? (
        <>
          <Input value={text} onChangeText={setText} keyboardType="decimal-pad" accessibilityLabel={`Abono de ${debt.contactName}`} autoFocus />
          {error ? <ErrorNote message={error} /> : null}
          <Button title="Guardar abono" onPress={() => void pay()} loading={saving} />
        </>
      ) : (
        <View style={{ flexDirection: "row", gap: space(2) }}>
          <View style={{ flex: 1 }}>
            <Button title="Abonar" onPress={() => setPaying(true)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Cobrar"
              variant="secondary"
              onPress={() => void Linking.openURL(whatsappLink(reminder, debt.contactPhone, business.country))}
            />
          </View>
        </View>
      )}
    </Card>
  );
}
