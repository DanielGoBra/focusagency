import type { SupabaseClient } from "@supabase/supabase-js";
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
} from "@negocios/core";
import { RepoError, type NewBusiness, type NewExpense, type NewProduct, type Repo, type Session } from "./repo";

type Row = Record<string, unknown>;

const num = (value: unknown) => Number(value ?? 0);
const str = (value: unknown) => (value === null || value === undefined ? null : String(value));

// Postgres devuelve códigos; aquí se traducen a algo que la persona entienda.
function fail(error: { code?: string; message: string } | null, fallback: string): never {
  if (error?.code === "42501") throw new RepoError("No tienes permiso para hacer esto en este negocio.", error);
  if (error?.code === "22023" || error?.code === "23514") throw new RepoError(error.message, error);
  if (error?.message?.includes("Invalid login credentials")) throw new RepoError("Correo o contraseña incorrectos.", error);
  throw new RepoError(fallback, error);
}

function one<T>(row: unknown): T | null {
  if (Array.isArray(row)) return (row[0] as T) ?? null;
  return (row as T) ?? null;
}

const toProduct = (row: Row): Product => ({
  id: String(row.id),
  businessId: String(row.business_id),
  name: String(row.name),
  sku: str(row.sku),
  unit: row.unit as Product["unit"],
  price: num(row.price),
  cost: num(row.cost),
  stock: num(row.stock),
  minStock: num(row.min_stock),
  archived: Boolean(row.archived),
});

const toContact = (row: Row): Contact => ({
  id: String(row.id),
  businessId: String(row.business_id),
  kind: row.kind as ContactKind,
  name: String(row.name),
  phone: str(row.phone),
});

const toSale = (row: Row): Sale => ({
  id: String(row.id),
  businessId: String(row.business_id),
  soldAt: String(row.sold_at),
  status: row.status as Sale["status"],
  paymentMethod: (row.payment_method as PaymentMethod | null) ?? null,
  customerId: str(row.customer_id),
  customerName: one<{ name: string }>(row.contacts)?.name ?? null,
  subtotal: num(row.subtotal),
  discount: num(row.discount),
  total: num(row.total),
  note: str(row.note),
  items: ((row.sale_items as Row[] | null) ?? []).map((item) => ({
    productId: str(item.product_id),
    description: String(item.description),
    quantity: num(item.quantity),
    unitPrice: num(item.unit_price),
    unitCost: num(item.unit_cost),
    lineTotal: num(item.line_total),
  })),
});

const toExpense = (row: Row): Expense => ({
  id: String(row.id),
  businessId: String(row.business_id),
  spentAt: String(row.spent_at),
  amount: num(row.amount),
  category: String(row.category),
  paymentMethod: row.payment_method as PaymentMethod,
  supplierId: str(row.supplier_id),
  note: str(row.note),
});

const toDebt = (row: Row): Debt => {
  const contact = one<{ name: string; phone: string | null }>(row.contacts);
  return {
    id: String(row.id),
    businessId: String(row.business_id),
    kind: row.kind as Debt["kind"],
    contactId: String(row.contact_id),
    contactName: contact?.name ?? "Sin nombre",
    contactPhone: contact?.phone ?? null,
    amount: num(row.amount),
    balance: num(row.balance),
    dueDate: str(row.due_date),
    saleId: str(row.sale_id),
    createdAt: String(row.created_at),
  };
};

export function createSupabaseRepo(client: SupabaseClient): Repo {
  async function currentUserId(): Promise<string> {
    const { data } = await client.auth.getSession();
    const id = data.session?.user.id;
    if (!id) throw new RepoError("Tu sesión terminó. Vuelve a entrar.");
    return id;
  }

  return {
    mode: "supabase",

    async getSession() {
      const { data } = await client.auth.getSession();
      const user = data.session?.user;
      return user ? { userId: user.id, email: user.email ?? null } : null;
    },

    onSessionChange(listener) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        const user = session?.user;
        listener(user ? ({ userId: user.id, email: user.email ?? null } satisfies Session) : null);
      });
      return () => data.subscription.unsubscribe();
    },

    async signIn(email, password) {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) fail(error, "No pudimos iniciar sesión.");
    },

    async signUp(email, password) {
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) fail(error, "No pudimos crear la cuenta.");
      return { needsConfirmation: !data.session };
    },

    async signOut() {
      await client.auth.signOut();
    },

    async listBusinesses() {
      const userId = await currentUserId();
      const { data, error } = await client
        .from("memberships")
        .select("role, businesses(id, name, currency, country, time_zone)")
        .eq("user_id", userId)
        .order("created_at");
      if (error) fail(error, "No pudimos cargar tus negocios.");
      return (data as Row[]).flatMap((row) => {
        const business = one<Row>(row.businesses);
        if (!business) return [];
        return [
          {
            id: String(business.id),
            name: String(business.name),
            currency: String(business.currency),
            country: String(business.country),
            timeZone: String(business.time_zone),
            role: row.role as Business["role"],
          },
        ];
      });
    },

    async createBusiness(input: NewBusiness) {
      const { data, error } = await client
        .from("businesses")
        .insert({ name: input.name, currency: input.currency, country: input.country, time_zone: input.timeZone })
        .select("id, name, currency, country, time_zone")
        .single();
      if (error) fail(error, "No pudimos crear el negocio.");
      const row = data as Row;
      return {
        id: String(row.id),
        name: String(row.name),
        currency: String(row.currency),
        country: String(row.country),
        timeZone: String(row.time_zone),
        role: "owner",
      };
    },

    async listProducts(businessId) {
      const { data, error } = await client
        .from("products")
        .select("*")
        .eq("business_id", businessId)
        .eq("archived", false)
        .order("name");
      if (error) fail(error, "No pudimos cargar el inventario.");
      return (data as Row[]).map(toProduct);
    },

    async createProduct(businessId, input: NewProduct) {
      const { data, error } = await client
        .from("products")
        .insert({
          business_id: businessId,
          name: input.name,
          sku: input.sku,
          unit: input.unit,
          price: input.price,
          cost: input.cost,
          min_stock: input.minStock,
        })
        .select("*")
        .single();
      if (error) fail(error, "No pudimos crear el producto.");
      const product = toProduct(data as Row);

      if (input.initialStock > 0) {
        const { error: stockError } = await client.from("stock_movements").insert({
          business_id: businessId,
          product_id: product.id,
          quantity: input.initialStock,
          reason: "initial",
        });
        if (stockError) fail(stockError, "El producto se creó, pero no pudimos cargar su stock inicial.");
        product.stock = input.initialStock;
      }
      return product;
    },

    async listContacts(businessId, kind) {
      let query = client.from("contacts").select("*").eq("business_id", businessId).order("name");
      if (kind) query = query.eq("kind", kind);
      const { data, error } = await query;
      if (error) fail(error, "No pudimos cargar los contactos.");
      return (data as Row[]).map(toContact);
    },

    async createContact(businessId, input) {
      const { data, error } = await client
        .from("contacts")
        .insert({ business_id: businessId, kind: input.kind, name: input.name, phone: input.phone })
        .select("*")
        .single();
      if (error) fail(error, "No pudimos guardar el contacto.");
      return toContact(data as Row);
    },

    async listSales(businessId, range: Range) {
      const { data, error } = await client
        .from("sales")
        .select("*, sale_items(*), contacts(name)")
        .eq("business_id", businessId)
        .gte("sold_at", range.from.toISOString())
        .lt("sold_at", range.to.toISOString())
        .order("sold_at", { ascending: false });
      if (error) fail(error, "No pudimos cargar las ventas.");
      return (data as Row[]).map(toSale);
    },

    async createSale(businessId, draft: SaleDraft) {
      const { data, error } = await client.rpc("create_sale", {
        p_business_id: businessId,
        p_items: draft.lines.map((line) =>
          line.productId
            ? { product_id: line.productId, quantity: line.quantity, unit_price: line.unitPrice }
            : { description: line.description, quantity: line.quantity, unit_price: line.unitPrice },
        ),
        p_payment_method: draft.onCredit ? null : draft.paymentMethod,
        p_customer_id: draft.customerId,
        p_on_credit: draft.onCredit,
        p_discount: draft.discount,
        p_due_date: draft.dueDate,
        p_note: draft.note,
      });
      if (error) fail(error, "No pudimos guardar la venta.");
      return String(data);
    },

    async listExpenses(businessId, range: Range) {
      const { data, error } = await client
        .from("expenses")
        .select("*")
        .eq("business_id", businessId)
        .gte("spent_at", range.from.toISOString())
        .lt("spent_at", range.to.toISOString())
        .order("spent_at", { ascending: false });
      if (error) fail(error, "No pudimos cargar los gastos.");
      return (data as Row[]).map(toExpense);
    },

    async createExpense(businessId, input: NewExpense) {
      const { data, error } = await client
        .from("expenses")
        .insert({
          business_id: businessId,
          amount: input.amount,
          category: input.category,
          payment_method: input.paymentMethod,
          supplier_id: input.supplierId,
          note: input.note,
          ...(input.spentAt ? { spent_at: input.spentAt } : {}),
        })
        .select("*")
        .single();
      if (error) fail(error, "No pudimos guardar el gasto.");
      return toExpense(data as Row);
    },

    async listOpenDebts(businessId) {
      const { data, error } = await client
        .from("debts")
        .select("*, contacts(name, phone)")
        .eq("business_id", businessId)
        .eq("kind", "receivable")
        .gt("balance", 0)
        .order("created_at");
      if (error) fail(error, "No pudimos cargar los fiados.");
      return (data as Row[]).map(toDebt);
    },

    async listDebtPayments(businessId, range: Range) {
      const { data, error } = await client
        .from("debt_payments")
        .select("*, debts(kind)")
        .eq("business_id", businessId)
        .gte("paid_at", range.from.toISOString())
        .lt("paid_at", range.to.toISOString());
      if (error) fail(error, "No pudimos cargar los abonos.");
      return (data as Row[]).map(
        (row): DebtPayment => ({
          id: String(row.id),
          debtId: String(row.debt_id),
          kind: (one<{ kind: DebtPayment["kind"] }>(row.debts)?.kind ?? "receivable"),
          amount: num(row.amount),
          paymentMethod: row.payment_method as PaymentMethod,
          paidAt: String(row.paid_at),
        }),
      );
    },

    async payDebt(businessId, debtId, amount, paymentMethod) {
      const { error } = await client
        .from("debt_payments")
        .insert({ business_id: businessId, debt_id: debtId, amount, payment_method: paymentMethod });
      if (error) fail(error, "No pudimos registrar el abono.");
    },
  };
}
