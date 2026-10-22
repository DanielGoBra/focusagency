import type {
  Business,
  Contact,
  ContactKind,
  Debt,
  DebtPayment,
  Expense,
  PaymentMethod,
  Product,
  Range,
  Sale,
  SaleDraft,
  Unit,
} from "@negocios/core";

export type Session = { userId: string; email: string | null };

export type NewBusiness = { name: string; currency: string; country: string; timeZone: string };

export type NewProduct = {
  name: string;
  sku: string | null;
  unit: Unit;
  price: number;
  cost: number;
  minStock: number;
  initialStock: number;
};

export type NewExpense = {
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  supplierId: string | null;
  note: string | null;
  spentAt?: string;
};

/**
 * Todo lo que las apps leen o escriben pasa por aquí.
 * Hay dos implementaciones: Supabase (producción) y demo (en memoria, sin servidor).
 */
export interface Repo {
  readonly mode: "supabase" | "demo";

  getSession(): Promise<Session | null>;
  onSessionChange(listener: (session: Session | null) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<{ needsConfirmation: boolean }>;
  signOut(): Promise<void>;

  listBusinesses(): Promise<Business[]>;
  createBusiness(input: NewBusiness): Promise<Business>;

  listProducts(businessId: string): Promise<Product[]>;
  createProduct(businessId: string, input: NewProduct): Promise<Product>;

  listContacts(businessId: string, kind?: ContactKind): Promise<Contact[]>;
  createContact(businessId: string, input: { kind: ContactKind; name: string; phone: string | null }): Promise<Contact>;

  listSales(businessId: string, range: Range): Promise<Sale[]>;
  /** Guarda la venta, descuenta inventario y, si es fiada, crea la deuda. Devuelve el id. */
  createSale(businessId: string, draft: SaleDraft): Promise<string>;

  listExpenses(businessId: string, range: Range): Promise<Expense[]>;
  createExpense(businessId: string, input: NewExpense): Promise<Expense>;

  listOpenDebts(businessId: string): Promise<Debt[]>;
  listDebtPayments(businessId: string, range: Range): Promise<DebtPayment[]>;
  payDebt(businessId: string, debtId: string, amount: number, paymentMethod: PaymentMethod): Promise<void>;
}

/** Error con un mensaje listo para mostrarle a la persona. */
export class RepoError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "RepoError";
  }
}
