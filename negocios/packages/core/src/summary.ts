import { roundMoney, roundQty } from "./money";
import type { DebtPayment, Expense, PaymentMethod, Product, Sale } from "./types";

export type TopProduct = { key: string; description: string; quantity: number; total: number };

export type Summary = {
  salesTotal: number;
  salesCount: number;
  averageTicket: number;
  costOfGoods: number;
  grossProfit: number;
  /** Todo lo que salió en gastos, incluidas las compras de mercancía. */
  expensesTotal: number;
  /** Gastos sin compras de mercancía: lo que se resta para la ganancia. */
  operatingExpenses: number;
  profit: number;
  /** Plata que entró: ventas pagadas + abonos de clientes. */
  collected: number;
  /** Lo vendido a crédito en el periodo. */
  soldOnCredit: number;
  collectedByMethod: Record<PaymentMethod, number>;
  expensesByCategory: { category: string; amount: number }[];
  topProducts: TopProduct[];
};

/**
 * Las compras de mercancía reponen inventario; su costo ya entra en la ganancia
 * como "costo de lo vendido". Restarlas otra vez como gasto contaría doble.
 */
export const INVENTORY_PURCHASE_CATEGORY = "Mercancía";

const emptyByMethod = (): Record<PaymentMethod, number> => ({ cash: 0, card: 0, transfer: 0, other: 0 });

/**
 * Resume un periodo a partir de filas ya filtradas por fecha.
 * La ganancia descuenta el costo copiado en cada línea al momento de vender,
 * así un cambio de costo posterior no reescribe el pasado.
 */
export function summarize(input: {
  sales: Sale[];
  expenses: Expense[];
  debtPayments?: DebtPayment[];
  topLimit?: number;
}): Summary {
  const { sales, expenses, debtPayments = [], topLimit = 5 } = input;
  const collectedByMethod = emptyByMethod();
  const products = new Map<string, TopProduct>();

  let salesTotal = 0;
  let costOfGoods = 0;
  let soldOnCredit = 0;

  for (const sale of sales) {
    salesTotal += sale.total;
    if (sale.status === "credit") soldOnCredit += sale.total;
    else if (sale.paymentMethod) collectedByMethod[sale.paymentMethod] += sale.total;

    for (const item of sale.items) {
      costOfGoods += item.unitCost * item.quantity;
      const key = item.productId ?? `libre:${item.description.toLowerCase()}`;
      const current = products.get(key) ?? { key, description: item.description, quantity: 0, total: 0 };
      current.quantity = roundQty(current.quantity + item.quantity);
      current.total = roundMoney(current.total + item.lineTotal);
      products.set(key, current);
    }
  }

  for (const payment of debtPayments) {
    if (payment.kind === "receivable") collectedByMethod[payment.paymentMethod] += payment.amount;
  }

  const categories = new Map<string, number>();
  let expensesTotal = 0;
  let operatingExpenses = 0;
  for (const expense of expenses) {
    expensesTotal += expense.amount;
    if (expense.category !== INVENTORY_PURCHASE_CATEGORY) operatingExpenses += expense.amount;
    categories.set(expense.category, (categories.get(expense.category) ?? 0) + expense.amount);
  }

  for (const method of Object.keys(collectedByMethod) as PaymentMethod[]) {
    collectedByMethod[method] = roundMoney(collectedByMethod[method]);
  }

  salesTotal = roundMoney(salesTotal);
  costOfGoods = roundMoney(costOfGoods);
  expensesTotal = roundMoney(expensesTotal);
  operatingExpenses = roundMoney(operatingExpenses);
  const grossProfit = roundMoney(salesTotal - costOfGoods);

  return {
    salesTotal,
    salesCount: sales.length,
    averageTicket: sales.length ? roundMoney(salesTotal / sales.length) : 0,
    costOfGoods,
    grossProfit,
    expensesTotal,
    operatingExpenses,
    profit: roundMoney(grossProfit - operatingExpenses),
    collected: roundMoney(Object.values(collectedByMethod).reduce((sum, value) => sum + value, 0)),
    soldOnCredit: roundMoney(soldOnCredit),
    collectedByMethod,
    expensesByCategory: [...categories.entries()]
      .map(([category, amount]) => ({ category, amount: roundMoney(amount) }))
      .sort((a, b) => b.amount - a.amount),
    topProducts: [...products.values()]
      .filter((product) => !product.key.startsWith("libre:"))
      .sort((a, b) => b.total - a.total)
      .slice(0, topLimit),
  };
}

export function lowStock(products: Product[]): Product[] {
  return products
    .filter((product) => !product.archived && product.minStock > 0 && product.stock <= product.minStock)
    .sort((a, b) => a.stock / a.minStock - b.stock / b.minStock);
}
