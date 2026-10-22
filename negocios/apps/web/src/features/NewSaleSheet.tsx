import { useMemo, useState } from "react";
import { Minus, Plus, Search, Trash2, UserPlus } from "lucide-react";
import {
  acceptsFraction,
  formatMoney,
  formatQuantity,
  lineTotal,
  parseQuantity,
  PAYMENT_METHODS,
  quickLine,
  roundQty,
  saleTotals,
  validateSale,
  type PaymentMethod,
  type Product,
  type SaleDraft,
  type SaleLineInput,
} from "@negocios/core";
import { useBusiness } from "../lib/app-state";
import { repo } from "../lib/repo";
import { useAsync } from "../lib/use-async";
import { MoneyInput } from "../components/MoneyInput";
import { Button, cx, ErrorNote, Field, Input, Segmented, Select, Sheet } from "../components/ui";

type Mode = "quick" | "products";
type Payment = PaymentMethod | "credit";

export function NewSaleSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  // La key reinicia el formulario cada vez que se abre.
  const [round, setRound] = useState(0);
  const close = () => {
    onClose();
    setRound((value) => value + 1);
  };
  return (
    <Sheet open={open} onClose={close} title="Nueva venta">
      <SaleForm key={round} onDone={close} />
    </Sheet>
  );
}

function SaleForm({ onDone }: { onDone: () => void }) {
  const { business, changed, toast } = useBusiness();
  const [mode, setMode] = useState<Mode>("quick");
  const [amount, setAmount] = useState<number | null>(null);
  const [concept, setConcept] = useState("");
  const [cart, setCart] = useState<SaleLineInput[]>([]);
  const [discount, setDiscount] = useState<number | null>(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [payment, setPayment] = useState<Payment>("cash");
  const [customerId, setCustomerId] = useState("");
  const [newCustomer, setNewCustomer] = useState<{ name: string; phone: string } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const customers = useAsync(() => repo.listContacts(business.id, "customer"), [business.id]);

  const lines = mode === "quick" ? (amount ? [quickLine(amount, concept.trim() || "Venta rápida")] : []) : cart;
  const totals = saleTotals(lines, discount ?? 0);
  const onCredit = payment === "credit";

  async function save() {
    let chosenCustomer = customerId || null;
    const draft: SaleDraft = {
      lines,
      discount: discount ?? 0,
      onCredit,
      paymentMethod: onCredit ? "cash" : payment,
      customerId: onCredit ? chosenCustomer ?? (newCustomer?.name.trim() ? "nuevo" : null) : null,
      dueDate: null,
      note: null,
    };
    const problems = validateSale(draft);
    if (problems.length) {
      setErrors(problems);
      return;
    }

    setSaving(true);
    setErrors([]);
    try {
      if (onCredit && !chosenCustomer && newCustomer) {
        const created = await repo.createContact(business.id, {
          kind: "customer",
          name: newCustomer.name.trim(),
          phone: newCustomer.phone.trim() || null,
        });
        chosenCustomer = created.id;
      }
      await repo.createSale(business.id, { ...draft, customerId: onCredit ? chosenCustomer : null });
      toast(`${onCredit ? "Fiado registrado" : "Venta registrada"}: ${formatMoney(totals.total, business.currency)}`);
      changed();
      onDone();
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "No pudimos guardar la venta."]);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Segmented<Mode>
        label="Tipo de venta"
        value={mode}
        onChange={setMode}
        options={[
          { value: "quick", label: "Monto rápido" },
          { value: "products", label: "Con productos" },
        ]}
      />

      {mode === "quick" ? (
        <div className="space-y-4">
          <Field label="¿Cuánto vendiste?">
            {(id) => <MoneyInput id={id} large autoFocus value={amount} onChange={setAmount} currency={business.currency} />}
          </Field>
          <Field label="Concepto (opcional)">
            {(id) => <Input id={id} value={concept} onChange={(event) => setConcept(event.target.value)} placeholder="Ej.: mercado, recarga, domicilio" />}
          </Field>
        </div>
      ) : (
        <ProductPicker cart={cart} setCart={setCart} currency={business.currency} businessId={business.id} />
      )}

      {showDiscount ? (
        <Field label="Descuento">{(id) => <MoneyInput id={id} value={discount} onChange={setDiscount} currency={business.currency} />}</Field>
      ) : (
        <button type="button" className="text-sm font-semibold text-brand" onClick={() => setShowDiscount(true)}>
          + Agregar descuento
        </button>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink-2">¿Cómo pagó?</p>
        <Segmented<Payment>
          label="Medio de pago"
          value={payment}
          onChange={setPayment}
          options={[...PAYMENT_METHODS.filter((item) => item.value !== "other"), { value: "credit", label: "Fiado" }]}
        />
      </div>

      {onCredit ? (
        <div className="space-y-3 rounded-2xl bg-surface-2 p-4">
          {newCustomer ? (
            <>
              <Field label="Nombre del cliente">
                {(id) => <Input id={id} autoFocus value={newCustomer.name} onChange={(event) => setNewCustomer({ ...newCustomer, name: event.target.value })} />}
              </Field>
              <Field label="Celular (para cobrarle por WhatsApp)">
                {(id) => (
                  <Input id={id} inputMode="tel" value={newCustomer.phone} onChange={(event) => setNewCustomer({ ...newCustomer, phone: event.target.value })} />
                )}
              </Field>
              <button type="button" className="text-sm font-semibold text-ink-2" onClick={() => setNewCustomer(null)}>
                Elegir un cliente existente
              </button>
            </>
          ) : (
            <>
              <Field label="¿A quién le fías?">
                {(id) => (
                  <Select id={id} value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
                    <option value="">Elige el cliente</option>
                    {(customers.data ?? []).map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                onClick={() => {
                  setCustomerId("");
                  setNewCustomer({ name: "", phone: "" });
                }}
              >
                <UserPlus size={16} aria-hidden /> Cliente nuevo
              </button>
            </>
          )}
        </div>
      ) : null}

      {errors.length ? <ErrorNote message={errors.join(" ")} /> : null}

      <div className="sticky -bottom-5 -mx-5 -mb-5 border-t border-line bg-surface px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm text-ink-2">
            Total{totals.discount ? ` (descuento ${formatMoney(totals.discount, business.currency)})` : ""}
          </span>
          <span className="text-2xl font-semibold tabular-nums">{formatMoney(totals.total, business.currency)}</span>
        </div>
        <Button variant="primary" size="lg" className="w-full" disabled={saving || lines.length === 0} onClick={() => void save()}>
          {saving ? "Guardando…" : onCredit ? "Guardar fiado" : "Registrar venta"}
        </Button>
      </div>
    </div>
  );
}

function ProductPicker({
  cart,
  setCart,
  currency,
  businessId,
}: {
  cart: SaleLineInput[];
  setCart: (lines: SaleLineInput[]) => void;
  currency: string;
  businessId: string;
}) {
  const { version } = useBusiness();
  const products = useAsync(() => repo.listProducts(businessId), [businessId, version]);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return (products.data ?? []).filter((item) => !text || item.name.toLowerCase().includes(text)).slice(0, 12);
  }, [products.data, query]);

  function add(product: Product) {
    const existing = cart.find((line) => line.productId === product.id);
    if (existing) {
      if (!acceptsFraction(product.unit)) update(product.id, existing.quantity + 1);
      return;
    }
    setCart([
      ...cart,
      {
        productId: product.id,
        description: product.name,
        quantity: acceptsFraction(product.unit) ? 0.5 : 1,
        unitPrice: product.price,
        unit: product.unit,
        available: product.stock,
      },
    ]);
  }

  function update(productId: string | null, quantity: number) {
    setCart(cart.map((line) => (line.productId === productId ? { ...line, quantity: roundQty(quantity) } : line)));
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3" aria-hidden />
        <Input aria-label="Buscar producto" placeholder="Buscar producto" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {visible.map((product) => {
          const inCart = cart.some((line) => line.productId === product.id);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => add(product)}
              className={cx(
                "rounded-xl border px-3 py-2.5 text-left transition-colors",
                inCart ? "border-brand bg-brand-soft" : "border-line hover:bg-surface-2",
              )}
            >
              <span className="block truncate text-sm font-medium">{product.name}</span>
              <span className="flex justify-between gap-2 text-xs text-ink-3">
                <span className="tabular-nums">{formatMoney(product.price, currency)}</span>
                <span className={cx("tabular-nums", product.stock <= product.minStock && "text-warning")}>{formatQuantity(product.stock, product.unit)}</span>
              </span>
            </button>
          );
        })}
      </div>
      {products.data && visible.length === 0 ? <p className="text-sm text-ink-3">No hay productos con ese nombre.</p> : null}

      {cart.length ? (
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {cart.map((line) => (
            <li key={line.productId} className="flex items-center gap-3 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{line.description}</p>
                <p className="text-xs text-ink-3 tabular-nums">
                  {formatMoney(line.unitPrice, currency)} c/u · {formatMoney(lineTotal(line.quantity, line.unitPrice), currency)}
                </p>
              </div>
              {acceptsFraction(line.unit) ? (
                <QuantityField line={line} onChange={(value) => update(line.productId, value)} />
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Quitar una unidad de ${line.description}`}
                    className="grid size-9 place-items-center rounded-lg border border-line"
                    onClick={() => (line.quantity > 1 ? update(line.productId, line.quantity - 1) : setCart(cart.filter((item) => item !== line)))}
                  >
                    {line.quantity > 1 ? <Minus size={16} /> : <Trash2 size={16} />}
                  </button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Agregar una unidad de ${line.description}`}
                    className="grid size-9 place-items-center rounded-lg border border-line"
                    onClick={() => update(line.productId, line.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-3">Toca un producto para agregarlo.</p>
      )}
    </div>
  );
}

function QuantityField({ line, onChange }: { line: SaleLineInput; onChange: (value: number) => void }) {
  const [text, setText] = useState(String(line.quantity).replace(".", ","));
  return (
    <label className="flex items-center gap-1.5 text-sm">
      <span className="sr-only">Cantidad de {line.description}</span>
      <Input
        inputMode="decimal"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          const value = parseQuantity(event.target.value);
          if (value !== null) onChange(value);
        }}
        className="min-h-9 w-20 text-right tabular-nums"
      />
      <span className="text-ink-3">{line.unit}</span>
    </label>
  );
}
