import { describe, expect, it } from "vitest";
import { periodRange, quickLine, type SaleDraft } from "@negocios/core";
import { createDemoRepo } from "./demo";

const now = () => new Date(2026, 9, 21, 15, 0);
const draft = (overrides: Partial<SaleDraft>): SaleDraft => ({
  lines: [quickLine(5000)],
  discount: 0,
  onCredit: false,
  paymentMethod: "cash",
  customerId: null,
  dueDate: null,
  note: null,
  ...overrides,
});

describe("demo", () => {
  it("trae datos de ejemplo del mes", async () => {
    const repo = createDemoRepo({ now });
    const [business] = await repo.listBusinesses();
    const sales = await repo.listSales(business!.id, periodRange("month", now()));
    expect(business?.name).toBe("Tienda Doña Rosa");
    expect(sales.length).toBeGreaterThan(50);
  });

  it("vender descuenta inventario y fiar crea la deuda", async () => {
    const repo = createDemoRepo({ now });
    const [business] = await repo.listBusinesses();
    const before = (await repo.listProducts(business!.id)).find((item) => item.id === "p-queso")!;

    await repo.createSale(
      business!.id,
      draft({
        lines: [{ productId: "p-queso", description: "Queso", quantity: 0.5, unitPrice: 22000, unit: "kg" }],
        onCredit: true,
        customerId: "c-luis",
      }),
    );

    const after = (await repo.listProducts(business!.id)).find((item) => item.id === "p-queso")!;
    expect(after.stock).toBe(before.stock - 0.5);

    const debt = (await repo.listOpenDebts(business!.id)).find((item) => item.contactId === "c-luis")!;
    expect(debt.balance).toBe(11000);

    await repo.payDebt(business!.id, debt.id, 1000, "cash");
    await expect(repo.payDebt(business!.id, debt.id, 20000, "cash")).rejects.toThrow("supera el saldo");
  });

  it("guarda y recupera el estado", async () => {
    let saved: string | null = null;
    const storage = { load: () => saved, save: (value: string) => (saved = value) };
    const repo = createDemoRepo({ storage, now });
    await repo.createExpense("demo-negocio", { amount: 15000, category: "Transporte", paymentMethod: "cash", supplierId: null, note: "Domicilio" });

    const again = createDemoRepo({ storage, now });
    const expenses = await again.listExpenses("demo-negocio", periodRange("today", now()));
    expect(expenses.some((item) => item.note === "Domicilio")).toBe(true);
  });
});
