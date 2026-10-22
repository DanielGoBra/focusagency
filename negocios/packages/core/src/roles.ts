import type { Role } from "./types";

export type Action =
  | "recordSale"
  | "recordExpense"
  | "viewProfit"
  | "viewExpenses"
  | "manageProducts"
  | "manageTeam"
  | "exportReports";

const MANAGERS: Role[] = ["owner", "admin"];

const RULES: Record<Action, Role[]> = {
  recordSale: ["owner", "admin", "seller"],
  recordExpense: ["owner", "admin", "seller"],
  viewProfit: MANAGERS,
  viewExpenses: MANAGERS,
  manageProducts: MANAGERS,
  manageTeam: MANAGERS,
  exportReports: MANAGERS,
};

/** Debe coincidir con las políticas de supabase/migrations: la base de datos es quien manda. */
export function can(role: Role, action: Action): boolean {
  return RULES[action].includes(role);
}

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Dueño",
  admin: "Administrador",
  seller: "Vendedor",
};
