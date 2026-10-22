import { roundMoney, roundQty } from "./money";
import { acceptsFraction, UNITS } from "./units";
import type { PaymentMethod, Unit } from "./types";

export type SaleLineInput = {
  productId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: Unit;
  /** Stock disponible, si la línea viene del inventario. */
  available?: number;
};

export type SaleDraft = {
  lines: SaleLineInput[];
  discount: number;
  onCredit: boolean;
  paymentMethod: PaymentMethod;
  customerId: string | null;
  dueDate: string | null;
  note: string | null;
};

export function lineTotal(quantity: number, unitPrice: number): number {
  return roundMoney(roundQty(quantity) * roundMoney(unitPrice));
}

export function saleTotals(lines: Pick<SaleLineInput, "quantity" | "unitPrice">[], discount = 0) {
  const subtotal = roundMoney(lines.reduce((sum, line) => sum + lineTotal(line.quantity, line.unitPrice), 0));
  const cleanDiscount = roundMoney(Math.max(0, discount));
  return { subtotal, discount: cleanDiscount, total: roundMoney(subtotal - cleanDiscount) };
}

/** Línea de "venta rápida": un monto sin producto del inventario. */
export function quickLine(amount: number, description = "Venta rápida"): SaleLineInput {
  return { productId: null, description, quantity: 1, unitPrice: roundMoney(amount), unit: "unit" };
}

/** Errores en español, listos para mostrar. Lista vacía = la venta se puede guardar. */
export function validateSale(draft: SaleDraft): string[] {
  const errors: string[] = [];
  if (draft.lines.length === 0) errors.push("Agrega un producto o un monto.");

  draft.lines.forEach((line) => {
    const name = line.description.trim() || "La línea";
    if (!(line.quantity > 0)) errors.push(`${name}: la cantidad debe ser mayor que cero.`);
    if (!acceptsFraction(line.unit) && !Number.isInteger(line.quantity)) {
      errors.push(`${name}: se vende por ${UNITS[line.unit].label.toLowerCase()}, sin fracciones.`);
    }
    if (line.unitPrice < 0) errors.push(`${name}: el precio no puede ser negativo.`);
    if (line.available !== undefined && line.quantity > line.available) {
      errors.push(`${name}: solo hay ${line.available} en inventario.`);
    }
  });

  const totals = saleTotals(draft.lines, draft.discount);
  if (draft.discount < 0) errors.push("El descuento no puede ser negativo.");
  if (totals.discount > totals.subtotal) errors.push("El descuento no puede superar el subtotal.");
  else if (draft.lines.length > 0 && totals.total <= 0) errors.push("El total debe ser mayor que cero.");
  if (draft.onCredit && !draft.customerId) errors.push("Para fiar, elige el cliente.");
  return errors;
}
