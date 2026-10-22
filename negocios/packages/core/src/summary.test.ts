import { describe, expect, it } from "vitest";
import { lowStock, summarize } from "./summary";
import type { Expense, Product, Sale } from "./types";

const sale = (overrides: Partial<Sale>): Sale => ({
  id: "s",
  businessId: "b",
  soldAt: "2026-10-20T15:00:00Z",
  status: "paid",
  paymentMethod: "cash",
  customerId: null,
  customerName: null,
  subtotal: 0,
  discount: 0,
  total: 0,
  note: null,
  items: [],
  ...overrides,
});

const expense = (amount: number, category: string): Expense => ({
  id: category,
  businessId: "b",
  spentAt: "2026-10-20T15:00:00Z",
  amount,
  category,
  paymentMethod: "cash",
  supplierId: null,
  note: null,
});

describe("summarize", () => {
  const sales: Sale[] = [
    sale({
      id: "s1",
      total: 7500,
      items: [{ productId: "gaseosa", description: "Gaseosa", quantity: 3, unitPrice: 2500, unitCost: 1600, lineTotal: 7500 }],
    }),
    sale({
      id: "s2",
      paymentMethod: "transfer",
      total: 4837.5,
      items: [{ productId: "queso", description: "Queso", quantity: 0.375, unitPrice: 12900, unitCost: 9000, lineTotal: 4837.5 }],
    }),
    sale({
      id: "s3",
      status: "credit",
      paymentMethod: null,
      total: 10000,
      items: [{ productId: null, description: "Venta rápida", quantity: 1, unitPrice: 10000, unitCost: 0, lineTotal: 10000 }],
    }),
  ];

  const result = summarize({
    sales,
    expenses: [expense(20000, "Arriendo"), expense(5000, "Servicios"), expense(3000, "Servicios"), expense(9000, "Mercancía")],
    debtPayments: [
      { id: "p1", debtId: "d1", kind: "receivable", amount: 4000, paymentMethod: "cash", paidAt: "2026-10-20T16:00:00Z" },
      { id: "p2", debtId: "d2", kind: "payable", amount: 9000, paymentMethod: "cash", paidAt: "2026-10-20T16:00:00Z" },
    ],
  });

  it("suma ventas, costo y ganancia", () => {
    expect(result.salesTotal).toBe(22337.5);
    expect(result.salesCount).toBe(3);
    expect(result.costOfGoods).toBe(8175);
    expect(result.grossProfit).toBe(14162.5);
    expect(result.expensesTotal).toBe(37000);
    expect(result.operatingExpenses).toBe(28000);
    // La mercancía ya está en el costo de lo vendido: no se resta dos veces.
    expect(result.profit).toBe(-13837.5);
  });

  it("separa lo cobrado de lo fiado", () => {
    expect(result.soldOnCredit).toBe(10000);
    expect(result.collectedByMethod).toEqual({ cash: 11500, transfer: 4837.5, card: 0, other: 0 });
    expect(result.collected).toBe(16337.5);
  });

  it("ordena gastos por categoría y productos por ventas", () => {
    expect(result.expensesByCategory).toEqual([
      { category: "Arriendo", amount: 20000 },
      { category: "Mercancía", amount: 9000 },
      { category: "Servicios", amount: 8000 },
    ]);
    expect(result.topProducts.map((product) => product.key)).toEqual(["gaseosa", "queso"]);
  });
});

describe("lowStock", () => {
  const product = (id: string, stock: number, minStock: number): Product => ({
    id,
    businessId: "b",
    name: id,
    sku: null,
    unit: "unit",
    price: 1,
    cost: 1,
    stock,
    minStock,
    archived: false,
  });

  it("lista lo que cruzó el mínimo, lo más urgente primero", () => {
    const result = lowStock([product("a", 5, 10), product("b", 1, 10), product("c", 20, 10), product("d", 0, 0)]);
    expect(result.map((item) => item.id)).toEqual(["b", "a"]);
  });
});
