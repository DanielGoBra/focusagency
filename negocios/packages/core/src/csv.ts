import { dayKey, formatTime } from "./periods";
import { paymentLabel } from "./types";
import type { Expense, Sale } from "./types";

type Cell = string | number | null;

// Excel en español usa punto y coma como separador y coma decimal.
// El BOM hace que abra las tildes bien.
export function toCsv(rows: Cell[][]): string {
  const body = rows
    .map((row) =>
      row
        .map((cell) => {
          if (cell === null) return "";
          const text = typeof cell === "number" ? String(cell).replace(".", ",") : cell;
          return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
        })
        .join(";"),
    )
    .join("\r\n");
  return `﻿${body}\r\n`;
}

export function salesCsv(sales: Sale[]): string {
  const rows: Cell[][] = [["Fecha", "Hora", "Cliente", "Pago", "Productos", "Subtotal", "Descuento", "Total"]];
  for (const sale of sales) {
    rows.push([
      dayKey(sale.soldAt),
      formatTime(sale.soldAt),
      sale.customerName,
      paymentLabel(sale.status === "credit" ? null : sale.paymentMethod),
      sale.items.map((item) => `${item.quantity} x ${item.description}`).join(", "),
      sale.subtotal,
      sale.discount,
      sale.total,
    ]);
  }
  return toCsv(rows);
}

export function expensesCsv(expenses: Expense[]): string {
  const rows: Cell[][] = [["Fecha", "Categoría", "Pago", "Nota", "Monto"]];
  for (const expense of expenses) {
    rows.push([dayKey(expense.spentAt), expense.category, paymentLabel(expense.paymentMethod), expense.note, expense.amount]);
  }
  return toCsv(rows);
}
