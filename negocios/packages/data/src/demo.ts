import {
  inRange,
  lineTotal,
  roundMoney,
  roundQty,
  saleTotals,
  validateSale,
  type Business,
  type Contact,
  type Debt,
  type DebtPayment,
  type Expense,
  type PaymentMethod,
  type Product,
  type Sale,
} from "@negocios/core";
import { RepoError, type Repo, type Session } from "./repo";

/** Dónde guardar el estado de la demo entre recargas (localStorage en web). */
export type DemoStorage = { load(): string | null; save(value: string): void };

type DemoState = {
  version: 1;
  session: Session | null;
  businesses: Business[];
  products: Product[];
  contacts: Contact[];
  sales: Sale[];
  expenses: Expense[];
  debts: Debt[];
  payments: DebtPayment[];
};

const BUSINESS_ID = "demo-negocio";

let counter = 0;
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

// Generador con semilla: la demo se ve igual cada vez que se abre.
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedState(now: Date): DemoState {
  const random = seeded(30);
  const pick = <T>(items: T[]): T => items[Math.floor(random() * items.length)] as T;

  const product = (id: string, name: string, unit: Product["unit"], price: number, cost: number, stock: number, minStock: number): Product => ({
    id,
    businessId: BUSINESS_ID,
    name,
    sku: null,
    unit,
    price,
    cost,
    stock,
    minStock,
    archived: false,
  });

  const products: Product[] = [
    product("p-gaseosa", "Gaseosa 400 ml", "unit", 2500, 1600, 48, 24),
    product("p-arroz", "Arroz libra", "unit", 3200, 2400, 30, 10),
    product("p-queso", "Queso campesino", "kg", 22000, 16000, 3.5, 2),
    product("p-huevo", "Huevo AA", "unit", 600, 450, 90, 60),
    product("p-pan", "Pan tajado", "unit", 6500, 4800, 4, 6),
    product("p-aceite", "Aceite 1 L", "unit", 11900, 9500, 8, 5),
    product("p-leche", "Leche 1 L", "unit", 4800, 3900, 12, 12),
    product("p-cafe", "Café 250 g", "unit", 9800, 7200, 15, 5),
  ];

  const contacts: Contact[] = [
    { id: "c-pedro", businessId: BUSINESS_ID, kind: "customer", name: "Pedro Pérez", phone: "3001234567" },
    { id: "c-marta", businessId: BUSINESS_ID, kind: "customer", name: "Marta Gómez", phone: "3109876543" },
    { id: "c-luis", businessId: BUSINESS_ID, kind: "customer", name: "Luis Rojas", phone: null },
    { id: "c-sol", businessId: BUSINESS_ID, kind: "supplier", name: "Distribuidora El Sol", phone: "6015551234" },
  ];

  const sales: Sale[] = [];
  const expenses: Expense[] = [];
  const methods: PaymentMethod[] = ["cash", "cash", "cash", "transfer", "transfer", "card"];

  for (let daysAgo = 40; daysAgo >= 0; daysAgo--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
    const salesToday = daysAgo === 0 ? Math.min(6, Math.max(1, now.getHours() - 7)) : 6 + Math.floor(random() * 7);

    for (let index = 0; index < salesToday; index++) {
      const soldAt = new Date(day);
      soldAt.setHours(7 + Math.floor(random() * 13), Math.floor(random() * 60));
      if (soldAt > now) continue;

      const items = Array.from({ length: 1 + Math.floor(random() * 3) }, () => {
        const item = pick(products);
        const quantity = item.unit === "kg" ? roundQty(0.25 + Math.floor(random() * 4) * 0.125) : 1 + Math.floor(random() * 3);
        return {
          productId: item.id,
          description: item.name,
          quantity,
          unitPrice: item.price,
          unitCost: item.cost,
          lineTotal: lineTotal(quantity, item.price),
        };
      });
      const subtotal = roundMoney(items.reduce((sum, item) => sum + item.lineTotal, 0));
      sales.push({
        id: `s-${daysAgo}-${index}`,
        businessId: BUSINESS_ID,
        soldAt: soldAt.toISOString(),
        status: "paid",
        paymentMethod: pick(methods),
        customerId: null,
        customerName: null,
        subtotal,
        discount: 0,
        total: subtotal,
        note: null,
        items,
      });
    }

    const at = (hour: number) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour).toISOString();
    if (day.getDate() === 1) {
      expenses.push(expense(`e-arriendo-${daysAgo}`, at(9), 650000, "Arriendo", "transfer", null));
    }
    if (day.getDay() === 1) {
      expenses.push(expense(`e-mercancia-${daysAgo}`, at(10), 380000 + Math.floor(random() * 12) * 10000, "Mercancía", "transfer", "c-sol"));
    }
    if (day.getDate() === 15) {
      expenses.push(expense(`e-servicios-${daysAgo}`, at(11), 186500, "Servicios", "transfer", null));
    }
    if (random() < 0.25) {
      expenses.push(expense(`e-transporte-${daysAgo}`, at(16), 12000, "Transporte", "cash", null));
    }
  }

  const fiado = (id: string, contact: Contact, daysAgo: number, total: number, paid: number): [Sale, Debt, DebtPayment[]] => {
    const soldAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, 18).toISOString();
    const sale: Sale = {
      id,
      businessId: BUSINESS_ID,
      soldAt,
      status: "credit",
      paymentMethod: null,
      customerId: contact.id,
      customerName: contact.name,
      subtotal: total,
      discount: 0,
      total,
      note: null,
      items: [{ productId: null, description: "Mercado del mes", quantity: 1, unitPrice: total, unitCost: 0, lineTotal: total }],
    };
    const debt: Debt = {
      id: `d-${id}`,
      businessId: BUSINESS_ID,
      kind: "receivable",
      contactId: contact.id,
      contactName: contact.name,
      contactPhone: contact.phone,
      amount: total,
      balance: roundMoney(total - paid),
      dueDate: null,
      saleId: id,
      createdAt: soldAt,
    };
    const payments: DebtPayment[] = paid
      ? [{ id: `pay-${id}`, debtId: debt.id, kind: "receivable", amount: paid, paymentMethod: "cash", paidAt: new Date(now.getTime() - 86400000).toISOString() }]
      : [];
    return [sale, debt, payments];
  };

  const [sale1, debt1, payments1] = fiado("s-fiado-1", contacts[0]!, 12, 86000, 30000);
  const [sale2, debt2, payments2] = fiado("s-fiado-2", contacts[1]!, 4, 42500, 0);
  sales.push(sale1, sale2);

  return {
    version: 1,
    session: null,
    businesses: [{ id: BUSINESS_ID, name: "Tienda Doña Rosa", currency: "COP", country: "CO", timeZone: "America/Bogota", role: "owner" }],
    products,
    contacts,
    sales: sales.sort((a, b) => b.soldAt.localeCompare(a.soldAt)),
    expenses: expenses.sort((a, b) => b.spentAt.localeCompare(a.spentAt)),
    debts: [debt1, debt2],
    payments: [...payments1, ...payments2],
  };
}

function expense(id: string, spentAt: string, amount: number, category: string, paymentMethod: PaymentMethod, supplierId: string | null): Expense {
  return { id, businessId: BUSINESS_ID, spentAt, amount, category, paymentMethod, supplierId, note: null };
}

/**
 * Datos de demostración en memoria: permite ver y probar las apps sin Supabase.
 * Imita las reglas de la base de datos (stock por movimientos, fiados con saldo).
 */
export function createDemoRepo(options: { storage?: DemoStorage; now?: () => Date } = {}): Repo {
  const now = options.now ?? (() => new Date());
  let state: DemoState = load() ?? seedState(now());
  const listeners = new Set<(session: Session | null) => void>();

  function load(): DemoState | null {
    try {
      const raw = options.storage?.load();
      const parsed = raw ? (JSON.parse(raw) as DemoState) : null;
      return parsed?.version === 1 ? parsed : null;
    } catch {
      return null;
    }
  }

  function save() {
    try {
      options.storage?.save(JSON.stringify(state));
    } catch {
      // Sin almacenamiento la demo sigue funcionando en memoria.
    }
  }

  // Copia profunda y un pequeño retraso: se comporta como una respuesta de red.
  const delay = <T>(value: T) =>
    new Promise<T>((resolve) => setTimeout(() => resolve(JSON.parse(JSON.stringify(value)) as T), 120));

  function signIn(email: string) {
    state.session = { userId: "demo-usuario", email };
    save();
    listeners.forEach((listener) => listener(state.session));
  }

  return {
    mode: "demo",

    async getSession() {
      return state.session;
    },

    onSessionChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    async signIn(email) {
      signIn(email);
    },

    async signUp(email) {
      signIn(email);
      return { needsConfirmation: false };
    },

    // Salir de la demo la deja como nueva.
    async signOut() {
      state = seedState(now());
      save();
      listeners.forEach((listener) => listener(null));
    },

    async listBusinesses() {
      return delay(state.businesses);
    },

    async createBusiness(input) {
      const business: Business = { id: newId("b"), role: "owner", ...input };
      state.businesses.push(business);
      save();
      return business;
    },

    async listProducts(businessId) {
      return delay(state.products.filter((item) => item.businessId === businessId && !item.archived).sort((a, b) => a.name.localeCompare(b.name)));
    },

    async createProduct(businessId, input) {
      const product: Product = {
        id: newId("p"),
        businessId,
        name: input.name,
        sku: input.sku,
        unit: input.unit,
        price: input.price,
        cost: input.cost,
        stock: input.initialStock,
        minStock: input.minStock,
        archived: false,
      };
      state.products.push(product);
      save();
      return product;
    },

    async listContacts(businessId, kind) {
      return delay(state.contacts.filter((item) => item.businessId === businessId && (!kind || item.kind === kind)));
    },

    async createContact(businessId, input) {
      const contact: Contact = { id: newId("c"), businessId, ...input };
      state.contacts.push(contact);
      save();
      return contact;
    },

    async listSales(businessId, range) {
      return delay(state.sales.filter((sale) => sale.businessId === businessId && inRange(sale.soldAt, range)));
    },

    async createSale(businessId, draft) {
      const errors = validateSale(draft);
      if (errors.length) throw new RepoError(errors[0]!);

      const items = draft.lines.map((line) => {
        const product = line.productId ? state.products.find((item) => item.id === line.productId) : undefined;
        if (line.productId && !product) throw new RepoError("Producto no encontrado.");
        return {
          productId: line.productId,
          description: product?.name ?? line.description,
          quantity: roundQty(line.quantity),
          unitPrice: roundMoney(line.unitPrice),
          unitCost: product?.cost ?? 0,
          lineTotal: lineTotal(line.quantity, line.unitPrice),
        };
      });
      const totals = saleTotals(draft.lines, draft.discount);
      const customer = state.contacts.find((item) => item.id === draft.customerId) ?? null;
      const sale: Sale = {
        id: newId("s"),
        businessId,
        soldAt: now().toISOString(),
        status: draft.onCredit ? "credit" : "paid",
        paymentMethod: draft.onCredit ? null : draft.paymentMethod,
        customerId: customer?.id ?? null,
        customerName: customer?.name ?? null,
        ...totals,
        note: draft.note,
        items,
      };

      for (const item of items) {
        const product = state.products.find((candidate) => candidate.id === item.productId);
        if (product) product.stock = roundQty(product.stock - item.quantity);
      }
      if (draft.onCredit && customer && sale.total > 0) {
        state.debts.push({
          id: newId("d"),
          businessId,
          kind: "receivable",
          contactId: customer.id,
          contactName: customer.name,
          contactPhone: customer.phone,
          amount: sale.total,
          balance: sale.total,
          dueDate: draft.dueDate,
          saleId: sale.id,
          createdAt: sale.soldAt,
        });
      }
      state.sales.unshift(sale);
      save();
      return sale.id;
    },

    async listExpenses(businessId, range) {
      return delay(state.expenses.filter((item) => item.businessId === businessId && inRange(item.spentAt, range)));
    },

    async createExpense(businessId, input) {
      if (!(input.amount > 0)) throw new RepoError("El monto debe ser mayor que cero.");
      const created: Expense = {
        id: newId("e"),
        businessId,
        spentAt: input.spentAt ?? now().toISOString(),
        amount: roundMoney(input.amount),
        category: input.category,
        paymentMethod: input.paymentMethod,
        supplierId: input.supplierId,
        note: input.note,
      };
      state.expenses.unshift(created);
      save();
      return created;
    },

    async listOpenDebts(businessId) {
      return delay(state.debts.filter((debt) => debt.businessId === businessId && debt.kind === "receivable" && debt.balance > 0));
    },

    async listDebtPayments(businessId, range) {
      const debtIds = new Set(state.debts.filter((debt) => debt.businessId === businessId).map((debt) => debt.id));
      return delay(state.payments.filter((payment) => debtIds.has(payment.debtId) && inRange(payment.paidAt, range)));
    },

    async payDebt(businessId, debtId, amount, paymentMethod) {
      const debt = state.debts.find((item) => item.id === debtId && item.businessId === businessId);
      if (!debt) throw new RepoError("No encontramos ese fiado.");
      if (!(amount > 0)) throw new RepoError("El abono debe ser mayor que cero.");
      if (amount > debt.balance) throw new RepoError("El abono supera el saldo.");
      debt.balance = roundMoney(debt.balance - amount);
      state.payments.push({ id: newId("pay"), debtId, kind: debt.kind, amount: roundMoney(amount), paymentMethod, paidAt: now().toISOString() });
      save();
    },
  };
}
