import { useEffect, useMemo, useState } from "react";
import { Package, Plus, Search } from "lucide-react";
import { can, formatMoney, formatQuantity, parseQuantity, UNITS, type Unit } from "@negocios/core";
import { useBusiness } from "../lib/app-state";
import { repo } from "../lib/repo";
import { useAsync } from "../lib/use-async";
import { MoneyInput } from "../components/MoneyInput";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Select, Sheet, Skeleton } from "../components/ui";

export function Products() {
  const { business, version } = useBusiness();
  const products = useAsync(() => repo.listProducts(business.id), [business.id, version]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const manager = can(business.role, "manageProducts");
  const money = (value: number) => formatMoney(value, business.currency);

  useEffect(() => {
    document.title = `Inventario · ${business.name}`;
  }, [business.name]);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return (products.data ?? []).filter((item) => !text || item.name.toLowerCase().includes(text));
  }, [products.data, query]);

  const value = (products.data ?? []).reduce((sum, item) => sum + Math.max(0, item.stock) * item.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Inventario</h1>
          <p className="mt-1 text-ink-3 tabular-nums">
            {products.data ? `${products.data.length} productos${manager ? ` · ${money(value)} en bodega (a costo)` : ""}` : "Cargando…"}
          </p>
        </div>
        {manager ? (
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setOpen(true)}>
            Nuevo producto
          </Button>
        ) : null}
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3" aria-hidden />
        <Input aria-label="Buscar producto" placeholder="Buscar producto" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" />
      </div>

      {products.error ? <ErrorNote message={products.error} onRetry={products.reload} /> : null}

      {!products.data ? (
        <Skeleton className="h-64" />
      ) : visible.length === 0 ? (
        <Card>
          <Empty icon={<Package size={22} />} title={query ? "No hay productos con ese nombre" : "Aún no tienes productos"}>
            {manager && !query ? "Crea tus productos para vender más rápido y saber qué se acaba." : null}
          </Empty>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-ink-3">
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3 font-medium">Producto</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Precio</th>
                {manager ? <th scope="col" className="px-5 py-3 text-right font-medium">Costo</th> : null}
                <th scope="col" className="px-5 py-3 text-right font-medium">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((product) => {
                const low = product.minStock > 0 && product.stock <= product.minStock;
                return (
                  <tr key={product.id}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-ink-3">{UNITS[product.unit].label}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{money(product.price)}</td>
                    {manager ? <td className="px-5 py-3.5 text-right text-ink-2 tabular-nums">{money(product.cost)}</td> : null}
                    <td className="px-5 py-3.5 text-right">
                      {low ? (
                        <Badge tone={product.stock <= 0 ? "danger" : "warning"}>{formatQuantity(product.stock, product.unit)}</Badge>
                      ) : (
                        <span className="tabular-nums">{formatQuantity(product.stock, product.unit)}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {manager ? <NewProductSheet open={open} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}

function NewProductSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [round, setRound] = useState(0);
  const close = () => {
    onClose();
    setRound((value) => value + 1);
  };
  return (
    <Sheet open={open} onClose={close} title="Nuevo producto">
      <ProductForm key={round} onDone={close} />
    </Sheet>
  );
}

function ProductForm({ onDone }: { onDone: () => void }) {
  const { business, changed, toast } = useBusiness();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<Unit>("unit");
  const [price, setPrice] = useState<number | null>(null);
  const [cost, setCost] = useState<number | null>(null);
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const margin = price && cost ? Math.round(((price - cost) / price) * 100) : null;

  async function save() {
    const initialStock = stock ? parseQuantity(stock) : 0;
    const min = minStock ? parseQuantity(minStock) : 0;
    if (!name.trim()) return setError("Escribe el nombre del producto.");
    if (price === null || price < 0) return setError("Escribe el precio de venta.");
    if (initialStock === null || min === null) return setError("Revisa las cantidades.");
    if (unit === "unit" && (!Number.isInteger(initialStock) || !Number.isInteger(min))) {
      return setError("Un producto por unidad no lleva decimales en el stock.");
    }

    setSaving(true);
    setError(null);
    try {
      await repo.createProduct(business.id, { name: name.trim(), sku: null, unit, price, cost: cost ?? 0, minStock: min, initialStock });
      toast(`Producto creado: ${name.trim()}`);
      changed();
      onDone();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos crear el producto.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Field label="Nombre">{(id) => <Input id={id} autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej.: Gaseosa 400 ml" />}</Field>
      <Field label="Se vende por">
        {(id) => (
          <Select id={id} value={unit} onChange={(event) => setUnit(event.target.value as Unit)}>
            {(Object.keys(UNITS) as Unit[]).map((key) => (
              <option key={key} value={key}>
                {UNITS[key].label}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={`Precio por ${UNITS[unit].short}`}>{(id) => <MoneyInput id={id} value={price} onChange={setPrice} currency={business.currency} />}</Field>
        <Field label="Costo" hint={margin !== null ? `Margen ${margin} %` : "Lo que te cuesta a ti"}>
          {(id) => <MoneyInput id={id} value={cost} onChange={setCost} currency={business.currency} />}
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Stock inicial">{(id) => <Input id={id} inputMode="decimal" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="0" />}</Field>
        <Field label="Avisar con menos de">{(id) => <Input id={id} inputMode="decimal" value={minStock} onChange={(event) => setMinStock(event.target.value)} placeholder="0" />}</Field>
      </div>
      {error ? <ErrorNote message={error} /> : null}
      <Button variant="primary" size="lg" className="w-full" disabled={saving} onClick={() => void save()}>
        {saving ? "Guardando…" : "Crear producto"}
      </Button>
    </div>
  );
}
