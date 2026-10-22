export type Period = "today" | "week" | "month";

export const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Hoy" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
];

export type Range = { from: Date; to: Date };

/** Rango [from, to) en la hora local del dispositivo. La semana empieza el lunes. */
export function periodRange(period: Period, now: Date = new Date()): Range {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "today") {
    return { from: start, to: addDays(start, 1) };
  }
  if (period === "week") {
    const sinceMonday = (start.getDay() + 6) % 7;
    const from = addDays(start, -sinceMonday);
    return { from, to: addDays(from, 7) };
  }
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from, to: new Date(now.getFullYear(), now.getMonth() + 1, 1) };
}

export function inRange(iso: string, range: Range): boolean {
  const time = new Date(iso).getTime();
  return time >= range.from.getTime() && time < range.to.getTime();
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** "2026-10-22" en la zona horaria dada (por defecto la del dispositivo). */
export function dayKey(iso: string, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function formatDay(key: string, locale = "es-CO"): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(date);
}

export function formatTime(iso: string, locale = "es-CO"): string {
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}
