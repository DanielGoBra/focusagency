// Montos con 2 decimales y cantidades con 3, igual que numeric(14,2) y
// numeric(14,3) en la base de datos.

export function roundMoney(value: number): number {
  return Math.round((value + Math.sign(value) * Number.EPSILON) * 100) / 100;
}

export function roundQty(value: number): number {
  return Math.round((value + Math.sign(value) * Number.EPSILON) * 1000) / 1000;
}

const ZERO_DECIMAL_CURRENCIES = new Set(["COP", "CLP", "PYG"]);

export function currencyDigits(currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency) ? 0 : 2;
}

export function formatMoney(value: number, currency = "COP", locale = "es-CO"): string {
  const digits = currencyDigits(currency);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** Cifra corta para tableros: $1,2 M, $350 mil. */
export function formatMoneyShort(value: number, currency = "COP", locale = "es-CO"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Lee un monto escrito como lo escribe la gente en Colombia:
 * "2.500", "$ 12.000", "2.500,50", "2500". Devuelve null si no es un número.
 */
export function parseAmount(text: string): number | null {
  const clean = text.replace(/[^\d.,-]/g, "");
  if (!/\d/.test(clean)) return null;

  let normalized: string;
  if (clean.includes(",")) {
    // La coma es el separador decimal; los puntos son miles.
    normalized = clean.replace(/\./g, "").replace(",", ".");
  } else if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(clean)) {
    normalized = clean.replace(/\./g, "");
  } else {
    normalized = clean;
  }

  const value = Number(normalized);
  return Number.isFinite(value) ? roundMoney(value) : null;
}

/** Lee una cantidad: "0,375", "0.375", "2" o "1,5". La coma y el punto son decimales. */
export function parseQuantity(text: string): number | null {
  const clean = text.trim().replace(",", ".");
  if (!/^-?\d*\.?\d+$/.test(clean)) return null;
  const value = Number(clean);
  return Number.isFinite(value) ? roundQty(value) : null;
}
