import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import {
  acceptsFraction,
  formatMoney,
  formatQuantity,
  parseAmount,
  PAYMENT_METHODS,
  quickLine,
  roundQty,
  saleTotals,
  validateSale,
  type PaymentMethod,
  type Product,
  type SaleLineInput,
} from "@negocios/core";
import { useBusiness, useLoad } from "../../lib/app-state";
import { repo } from "../../lib/repo";
import { radius, space, useColors } from "../../lib/theme";
import { Button, Card, Chips, ErrorNote, Input, Label, Muted, Row, Screen } from "../../components/ui";

type Mode = "quick" | "products";
type Payment = PaymentMethod | "credit";

export default function Vender() {
  const c = useColors();
  const { business, version, changed } = useBusiness();
  const [mode, setMode] = useState<Mode>("quick");
  const [amountText, setAmountText] = useState("");
  const [concept, setConcept] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [payment, setPayment] = useState<Payment>("cash");
  const [customerId, setCustomerId] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const products = useLoad(() => repo.listProducts(business.id), [business.id, version]);
  const customers = useLoad(() => repo.listContacts(business.id, "customer"), [business.id, version]);

  const amount = parseAmount(amountText);
  const productLines: SaleLineInput[] = (products.data ?? [])
    .filter((product) => (cart[product.id] ?? 0) > 0)
    .map((product) => ({
      productId: product.id,
      description: product.name,
      quantity: cart[product.id] ?? 0,
      unitPrice: product.price,
      unit: product.unit,
      available: product.stock,
    }));
  const lines = mode === "quick" ? (amount ? [quickLine(amount, concept.trim() || "Venta rápida")] : []) : productLines;
  const total = saleTotals(lines).total;
  const onCredit = payment === "credit";

  function step(product: Product, direction: 1 | -1) {
    const delta = acceptsFraction(product.unit) ? 0.25 : 1;
    setCart((current) => ({ ...current, [product.id]: Math.max(0, roundQty((current[product.id] ?? 0) + direction * delta)) }));
  }

  async function save() {
    const draft = {
      lines,
      discount: 0,
      onCredit,
      paymentMethod: onCredit ? ("cash" as const) : payment,
      customerId: onCredit ? customerId || null : null,
      dueDate: null,
      note: null,
    };
    const problems = validateSale(draft);
    if (problems.length) return setErrors(problems);
    setSaving(true);
    setErrors([]);
    try {
      await repo.createSale(business.id, draft);
      changed();
      Alert.alert(onCredit ? "Fiado registrado" : "Venta registrada", formatMoney(total, business.currency));
      setAmountText("");
      setConcept("");
      setCart({});
      setPayment("cash");
      setCustomerId("");
    } catch (reason) {
      setErrors([reason instanceof Error ? reason.message : "No pudimos guardar la venta."]);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen title="Vender" subtitle={business.name}>
      <Chips<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "quick", label: "Monto rápido" },
          { value: "products", label: "Con productos" },
        ]}
      />

      {mode === "quick" ? (
        <Card style={{ gap: space(3) }}>
          <Label>¿Cuánto vendiste?</Label>
          <Input large value={amountText} onChangeText={setAmountText} keyboardType="decimal-pad" placeholder="$ 0" accessibilityLabel="Monto de la venta" />
          <Label>Concepto (opcional)</Label>
          <Input value={concept} onChangeText={setConcept} placeholder="Ej.: mercado, recarga" accessibilityLabel="Concepto" />
        </Card>
      ) : (
        <Card style={{ padding: 0, gap: 0 }}>
          {(products.data ?? []).map((product, index) => {
            const quantity = cart[product.id] ?? 0;
            return (
              <Row key={product.id} style={{ paddingHorizontal: space(4), paddingVertical: space(3), borderTopWidth: index ? 1 : 0, borderTopColor: c.border }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "500", color: c.ink }}>{product.name}</Text>
                  <Muted>
                    {formatMoney(product.price, business.currency)} · quedan {formatQuantity(product.stock, product.unit)}
                  </Muted>
                </View>
                <Stepper
                  label={product.name}
                  value={quantity ? formatQuantity(quantity, product.unit) : "0"}
                  onMinus={() => step(product, -1)}
                  onPlus={() => step(product, 1)}
                />
              </Row>
            );
          })}
        </Card>
      )}

      <Card style={{ gap: space(3) }}>
        <Label>¿Cómo pagó?</Label>
        <Chips<Payment>
          value={payment}
          onChange={setPayment}
          options={[...PAYMENT_METHODS.filter((item) => item.value !== "other"), { value: "credit", label: "Fiado" }]}
        />
        {onCredit ? (
          <>
            <Label>¿A quién le fías?</Label>
            <Chips<string> value={customerId} onChange={setCustomerId} options={(customers.data ?? []).map((item) => ({ value: item.id, label: item.name }))} />
          </>
        ) : null}
      </Card>

      {errors.length ? <ErrorNote message={errors.join(" ")} /> : null}

      <Row>
        <Label>Total</Label>
        <Text style={{ fontSize: 28, fontWeight: "700", color: c.ink, fontVariant: ["tabular-nums"] }}>{formatMoney(total, business.currency)}</Text>
      </Row>
      <Button title={onCredit ? "Guardar fiado" : "Registrar venta"} onPress={() => void save()} disabled={!lines.length} loading={saving} />
    </Screen>
  );
}

function Stepper({ label, value, onMinus, onPlus }: { label: string; value: string; onMinus: () => void; onPlus: () => void }) {
  const c = useColors();
  const button = { width: 40, height: 40, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, alignItems: "center" as const, justifyContent: "center" as const };
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space(2) }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Quitar ${label}`} onPress={onMinus} style={button}>
        <Text style={{ fontSize: 20, color: c.ink }}>−</Text>
      </Pressable>
      <Text style={{ minWidth: 56, textAlign: "center", fontWeight: "600", color: c.ink, fontVariant: ["tabular-nums"] }}>{value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Agregar ${label}`} onPress={onPlus} style={button}>
        <Text style={{ fontSize: 20, color: c.ink }}>+</Text>
      </Pressable>
    </View>
  );
}
