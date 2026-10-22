import { describe, expect, it } from "vitest";
import { formatMoney, parseAmount, parseQuantity, roundMoney, roundQty } from "./money";

describe("parseAmount", () => {
  it.each([
    ["2.500", 2500],
    ["$ 12.000", 12000],
    ["1.250.000", 1250000],
    ["2500", 2500],
    ["2.500,50", 2500.5],
    ["0.5", 0.5],
    ["12.5", 12.5],
  ])("lee %s como %d", (text, expected) => {
    expect(parseAmount(text)).toBe(expected);
  });

  it("devuelve null sin dígitos", () => {
    expect(parseAmount("abc")).toBeNull();
    expect(parseAmount("")).toBeNull();
  });
});

describe("parseQuantity", () => {
  it("acepta coma o punto decimal", () => {
    expect(parseQuantity("0,375")).toBe(0.375);
    expect(parseQuantity("0.375")).toBe(0.375);
    expect(parseQuantity("2")).toBe(2);
  });

  it("rechaza texto", () => {
    expect(parseQuantity("dos")).toBeNull();
  });
});

describe("redondeo", () => {
  it("redondea montos a 2 decimales y cantidades a 3", () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
    expect(roundMoney(1.005)).toBe(1.01);
    expect(roundQty(0.3755)).toBe(0.376);
  });
});

describe("formatMoney", () => {
  it("muestra pesos sin decimales", () => {
    expect(formatMoney(12500).replace(/\s/g, " ")).toBe("$ 12.500");
  });
});
