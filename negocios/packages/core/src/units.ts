import type { Unit } from "./types";

export const UNITS: Record<Unit, { label: string; short: string; fractional: boolean }> = {
  unit: { label: "Unidad", short: "und", fractional: false },
  kg: { label: "Kilogramo", short: "kg", fractional: true },
  g: { label: "Gramo", short: "g", fractional: true },
  l: { label: "Litro", short: "L", fractional: true },
  ml: { label: "Mililitro", short: "ml", fractional: true },
};

export function formatQuantity(quantity: number, unit: Unit, locale = "es-CO"): string {
  const value = new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(quantity);
  return `${value} ${UNITS[unit].short}`;
}

export function acceptsFraction(unit: Unit): boolean {
  return UNITS[unit].fractional;
}
