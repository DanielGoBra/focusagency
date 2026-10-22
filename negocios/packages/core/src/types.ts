// Tipos del dominio. Los nombres en inglés coinciden con las tablas de
// supabase/migrations; las apps muestran todo en español.

export type Role = "owner" | "admin" | "seller";
export type Unit = "unit" | "kg" | "g" | "l" | "ml";
export type PaymentMethod = "cash" | "card" | "transfer" | "other";
export type ContactKind = "customer" | "supplier";
export type SaleStatus = "paid" | "credit";
export type DebtKind = "receivable" | "payable";

export type Business = {
  id: string;
  name: string;
  currency: string;
  country: string;
  timeZone: string;
  role: Role;
};

export type Product = {
  id: string;
  businessId: string;
  name: string;
  sku: string | null;
  unit: Unit;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  archived: boolean;
};

export type Contact = {
  id: string;
  businessId: string;
  kind: ContactKind;
  name: string;
  phone: string | null;
};

export type SaleItem = {
  productId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  lineTotal: number;
};

export type Sale = {
  id: string;
  businessId: string;
  soldAt: string;
  status: SaleStatus;
  paymentMethod: PaymentMethod | null;
  customerId: string | null;
  customerName: string | null;
  subtotal: number;
  discount: number;
  total: number;
  note: string | null;
  items: SaleItem[];
};

export type Expense = {
  id: string;
  businessId: string;
  spentAt: string;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  supplierId: string | null;
  note: string | null;
};

export type Debt = {
  id: string;
  businessId: string;
  kind: DebtKind;
  contactId: string;
  contactName: string;
  contactPhone: string | null;
  amount: number;
  balance: number;
  dueDate: string | null;
  saleId: string | null;
  createdAt: string;
};

export type DebtPayment = {
  id: string;
  debtId: string;
  kind: DebtKind;
  amount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
};

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Efectivo" },
  { value: "transfer", label: "Transferencia" },
  { value: "card", label: "Tarjeta" },
  { value: "other", label: "Otro" },
];

export function paymentLabel(method: PaymentMethod | null): string {
  if (!method) return "Fiado";
  return PAYMENT_METHODS.find((item) => item.value === method)?.label ?? method;
}

export const EXPENSE_CATEGORIES = [
  "Mercancía",
  "Arriendo",
  "Servicios",
  "Nómina",
  "Transporte",
  "Impuestos",
  "Mantenimiento",
  "Publicidad",
  "Otros",
] as const;
