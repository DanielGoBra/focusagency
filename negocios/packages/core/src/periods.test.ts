import { describe, expect, it } from "vitest";
import { inRange, periodRange } from "./periods";
import { normalizePhone, reminderMessage, whatsappLink } from "./debts";
import { can } from "./roles";
import { toCsv } from "./csv";

describe("periodRange", () => {
  const wednesday = new Date(2026, 9, 21, 18, 30);

  it("la semana empieza el lunes", () => {
    const range = periodRange("week", wednesday);
    expect(range.from).toEqual(new Date(2026, 9, 19));
    expect(range.to).toEqual(new Date(2026, 9, 26));
  });

  it("el mes va del 1 al 1", () => {
    const range = periodRange("month", wednesday);
    expect(range.from).toEqual(new Date(2026, 9, 1));
    expect(range.to).toEqual(new Date(2026, 10, 1));
  });

  it("hoy excluye la medianoche siguiente", () => {
    const range = periodRange("today", wednesday);
    expect(inRange(new Date(2026, 9, 21, 23, 59).toISOString(), range)).toBe(true);
    expect(inRange(new Date(2026, 9, 22, 0, 0).toISOString(), range)).toBe(false);
  });
});

describe("cobros por WhatsApp", () => {
  it("agrega el indicativo a celulares colombianos", () => {
    expect(normalizePhone("310 630 9679")).toBe("573106309679");
    expect(normalizePhone("+57 310 630 9679")).toBe("573106309679");
  });

  it("arma el enlace con el mensaje", () => {
    const text = reminderMessage({ businessName: "Tienda Rosita", contactName: "Pedro Pérez", balance: 15000, currency: "COP" });
    expect(text).toMatch(/^Hola Pedro, te saluda Tienda Rosita/);
    expect(whatsappLink(text, "3106309679")).toMatch(/^https:\/\/wa\.me\/573106309679\?text=Hola%20Pedro/);
  });
});

describe("permisos", () => {
  it("el vendedor vende pero no ve ganancias", () => {
    expect(can("seller", "recordSale")).toBe(true);
    expect(can("seller", "viewProfit")).toBe(false);
    expect(can("admin", "viewProfit")).toBe(true);
  });
});

describe("toCsv", () => {
  it("usa punto y coma, coma decimal y escapa comillas", () => {
    expect(toCsv([["Nota", "Monto"], ['Dijo "ya"', 2500.5]])).toBe('﻿Nota;Monto\r\n"Dijo ""ya""";2500,5\r\n');
  });
});
