import { useEffect, useRef, useState } from "react";
import { formatMoney, formatMoneyShort } from "@negocios/core";

export type ChartPoint = { key: string; label: string; detail: string; value: number };

/**
 * Columnas de una sola serie: un color, tope redondeado de 4 px, base recta,
 * rejilla discreta y un globo al pasar el mouse o enfocar con teclado.
 */
export function SalesChart({ points, currency, title }: { points: ChartPoint[]; currency: string; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  // Se dibuja al ancho real del contenedor para que el texto quede a 12 px en cualquier pantalla.
  const frame = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(640);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => entry && setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const height = width < 480 ? 180 : 220;
  const left = 52;
  const bottom = 28;
  const top = 12;
  const plotW = width - left - 8;
  const plotH = height - top - bottom;

  const max = Math.max(...points.map((point) => point.value), 0);
  const step = niceStep(max / 3);
  const ceiling = Math.max(step * 3, step);
  const ticks = [0, step, step * 2, step * 3].filter((tick) => tick <= ceiling);
  const band = plotW / Math.max(points.length, 1);
  const barW = Math.min(24, band - 2);
  const y = (value: number) => top + plotH - (value / ceiling) * plotH;
  const labelEvery = Math.ceil(points.length / Math.max(4, Math.floor(plotW / 56)));
  const current = active === null ? null : points[active];

  return (
    <figure ref={frame} className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="block max-w-full" role="img" aria-label={title}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={left} x2={width - 8} y1={y(tick)} y2={y(tick)} stroke="var(--chart-grid)" strokeWidth={1} />
            <text x={left - 8} y={y(tick) + 4} textAnchor="end" fontSize={12} fill="var(--ink-3)">
              {formatMoneyShort(tick, currency)}
            </text>
          </g>
        ))}
        {points.map((point, index) => {
          const x = left + index * band + (band - barW) / 2;
          const h = Math.max(0, top + plotH - y(point.value));
          const r = Math.min(4, h);
          return (
            <g
              key={point.key}
              tabIndex={0}
              role="img"
              aria-label={`${point.detail}: ${formatMoney(point.value, currency)}`}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className="outline-none"
            >
              {/* Área de toque más grande que la barra */}
              <rect x={left + index * band} y={top} width={band} height={plotH} fill="transparent" />
              {h > 0 ? (
                <path
                  d={`M${x},${top + plotH} V${y(point.value) + r} Q${x},${y(point.value)} ${x + r},${y(point.value)} H${x + barW - r} Q${x + barW},${y(point.value)} ${x + barW},${y(point.value) + r} V${top + plotH} Z`}
                  fill="var(--chart)"
                  opacity={active === null || active === index ? 1 : 0.45}
                />
              ) : null}
              {index % labelEvery === 0 ? (
                <text x={left + index * band + band / 2} y={height - 8} textAnchor="middle" fontSize={12} fill="var(--ink-3)">
                  {point.label}
                </text>
              ) : null}
            </g>
          );
        })}
        <line x1={left} x2={width - 8} y1={top + plotH} y2={top + plotH} stroke="var(--border)" strokeWidth={1} />
      </svg>
      {current && active !== null ? (
        <div
          className="pointer-events-none absolute top-0 rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-pop"
          style={{ left: `${((left + active * band + band / 2) / width) * 100}%`, transform: "translateX(-50%)" }}
        >
          <p className="whitespace-nowrap text-ink-3">{current.detail}</p>
          <p className="font-semibold tabular-nums">{formatMoney(current.value, currency)}</p>
        </div>
      ) : null}
    </figure>
  );
}

function niceStep(raw: number): number {
  if (raw <= 0) return 1000;
  const power = 10 ** Math.floor(Math.log10(raw));
  const fraction = raw / power;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * power;
}
