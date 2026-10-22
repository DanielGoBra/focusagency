import { useState } from "react";
import { formatMoney, parseAmount } from "@negocios/core";
import { cx, Input } from "./ui";

/** Campo de dinero: acepta "2.500", "2500" o "2.500,50" y muestra cómo lo entendió. */
export function MoneyInput({
  id,
  value,
  onChange,
  currency,
  autoFocus,
  large,
  placeholder = "0",
}: {
  id?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  currency: string;
  autoFocus?: boolean;
  large?: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState(value ? String(value) : "");
  const parsed = parseAmount(text);

  return (
    <div>
      <div className="relative">
        <span className={cx("pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3", large && "text-2xl")}>$</span>
        <Input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            onChange(parseAmount(event.target.value));
          }}
          className={cx("pl-8 tabular-nums", large && "min-h-16 pl-10 text-3xl font-semibold")}
        />
      </div>
      {/* Solo muestra cómo lo entendió si difiere de lo escrito (p. ej. "2500" → $ 2.500). */}
      {text && parsed !== null && digits(formatMoney(parsed, currency)) !== digits(text) ? (
        <p className="mt-1.5 text-sm text-ink-3">{formatMoney(parsed, currency)}</p>
      ) : null}
    </div>
  );
}

const digits = (value: string) => value.replace(/[^\d.,]/g, "");
