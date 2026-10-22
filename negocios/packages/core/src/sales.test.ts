import { describe, expect, it } from "vitest";
import { lineTotal, quickLine, saleTotals, validateSale, type SaleDraft } from "./sales";

const draft = (overrides: Partial<SaleDraft> = {}): SaleDraft => ({
  lines: [quickLine(10000)],
  discount: 0,
  onCredit: false,
  paymentMethod: "cash",
  customerId: null,
  dueDate: null,
  note: null,
  ...overrides,
});

describe("totales", () => {
  it("vende por peso y redondea al centavo", () => {
    expect(lineTotal(0.375, 12900)).toBe(4837.5);
  });

  it("aplica el descuento", () => {
    const totals = saleTotals(
      [
        { quantity: 3, unitPrice: 2500 },
        { quantity: 0.5, unitPrice: 8000 },
      ],
      1500,
    );
    expect(totals).toEqual({ subtotal: 11500, discount: 1500, total: 10000 });
  });
});

describe("validateSale", () => {
  it("acepta una venta rápida", () => {
    expect(validateSale(draft())).toEqual([]);
  });

  it("pide al menos una línea", () => {
    expect(validateSale(draft({ lines: [] }))).toContain("Agrega un producto o un monto.");
  });

  it("no deja fraccionar productos por unidad", () => {
    const errors = validateSale(
      draft({ lines: [{ productId: "p1", description: "Gaseosa", quantity: 1.5, unitPrice: 2500, unit: "unit" }] }),
    );
    expect(errors[0]).toMatch(/sin fracciones/);
  });

  it("permite fracciones en kilos", () => {
    const errors = validateSale(
      draft({ lines: [{ productId: "p2", description: "Queso", quantity: 0.375, unitPrice: 12900, unit: "kg" }] }),
    );
    expect(errors).toEqual([]);
  });

  it("no vende más de lo que hay", () => {
    const errors = validateSale(
      draft({ lines: [{ productId: "p1", description: "Gaseosa", quantity: 4, unitPrice: 2500, unit: "unit", available: 3 }] }),
    );
    expect(errors).toEqual(["Gaseosa: solo hay 3 en inventario."]);
  });

  it("exige cliente para fiar", () => {
    expect(validateSale(draft({ onCredit: true }))).toEqual(["Para fiar, elige el cliente."]);
  });

  it("no deja un descuento mayor al subtotal", () => {
    expect(validateSale(draft({ discount: 20000 }))).toEqual(["El descuento no puede superar el subtotal."]);
  });
});
