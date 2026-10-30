import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { areaY, barY, crosshair, defineChart, dot, lineY } from "@tanstack/charts";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { motion } from "@tanstack/charts/motion";
import { Chart } from "@tanstack/charts/react/core";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { curveMonotoneX } from "d3-shape";
import { useBrandDark } from "./brandTheme";

// Colores validados con el verificador de paletas (banda de luminosidad, contraste y daltonismo).
// BRAND_MARK pasa en fondo blanco y en la tarjeta navy; el cian de marca solo pinta el brillo.
const BRAND_MARK = "#1a9fd0";
function brandPaint(dark: boolean) {
  return {
    glow: dark ? "#3ef3ff" : "#2bbdef",
    line: dark ? "#3ef3ff" : BRAND_MARK,
    surface: dark ? "#0c1f3d" : "#ffffff",
    theme: {
      foreground: dark ? "rgb(244 251 255 / 0.85)" : "#202246",
      muted: dark ? "rgb(244 251 255 / 0.55)" : "rgb(32 34 70 / 0.6)",
      grid: dark ? "rgb(244 251 255 / 0.08)" : "rgb(32 34 70 / 0.08)",
      background: "transparent",
      palette: [BRAND_MARK],
    },
  };
}

const compact = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("es-CO");

const curve = d3Curve(curveMonotoneX);

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen]);
  return [ref, seen] as const;
}

/** Monta el gráfico cuando entra en pantalla, para que la animación de entrada se vea. */
function ChartStage({ height, tone, children }: { height: number; tone: "brand" | "light"; children: ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={tone === "brand" ? "chart-brand" : "chart-light"} style={{ minHeight: height }}>
      {seen ? children : null}
    </div>
  );
}

function useMotion() {
  return useMemo(() => motion({ transition: { type: "spring", stiffness: 140, damping: 18, mass: 1 } }), []);
}

const GROWTH = [
  { month: "Ene", leads: 18 },
  { month: "Feb", leads: 26 },
  { month: "Mar", leads: 31 },
  { month: "Abr", leads: 44 },
  { month: "May", leads: 52 },
  { month: "Jun", leads: 67 },
];

/** Área + línea: leads calificados por mes tras aplicar la estrategia (datos de ejemplo). */
export function GrowthChart({ height = 190 }: { height?: number }) {
  const renderer = useMotion();
  const dark = useBrandDark();
  const definition = useMemo(() => {
    const paint = brandPaint(dark);
    return defineChart({
        marks: [
          crosshair({ x: { label: true }, y: false, stroke: paint.glow, strokeOpacity: 0.5, strokeDasharray: "3 4" }),
          areaY(GROWTH, { x: "month", y: "leads", key: "month", fill: "url(#growth-fill)", fillOpacity: 1, curve }),
          lineY(GROWTH, { x: "month", y: "leads", key: "month", stroke: paint.line, strokeWidth: 2, curve }),
          dot(GROWTH.slice(-1), { x: "month", y: "leads", key: "month", r: 5, fill: paint.line, stroke: paint.surface, strokeWidth: 2 }),
        ],
        scales: {
          x: { scale: () => scalePoint<string>().padding(0.25) },
          y: {
            scale: scaleLinear,
            nice: true,
            grid: true,
            axis: { ticks: { count: 4, format: (value: number) => compact.format(value) } },
          },
        },
        gradients: [
          {
            id: "growth-fill",
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0,
            stops: [
              { offset: 0, color: BRAND_MARK, opacity: 0 },
              { offset: 1, color: paint.glow, opacity: 0.35 },
            ],
          },
        ],
        theme: paint.theme,
        focus: "group-x",
        maxFocusDistance: Number.POSITIVE_INFINITY,
        tooltip: {
          use: tooltip,
          items: [{ channel: "y", label: "Leads", text: (point) => `${whole.format(Number(point.yValue))} leads` }],
        },
      });
  }, [dark]);
  return (
    <ChartStage height={height} tone="brand">
      <Chart key={dark ? "dark" : "light"} definition={definition} renderer={renderer} height={height} idPrefix="growth" ariaLabel="Leads calificados por mes, datos de ejemplo" />
    </ChartStage>
  );
}

const CAMPAIGN = {
  alcance: { label: "Alcance", unit: "personas", rows: [12400, 18900, 21300, 26800, 31200, 36500] },
  clics: { label: "Clics", unit: "clics", rows: [410, 620, 700, 940, 1120, 1310] },
  leads: { label: "Leads", unit: "leads", rows: [22, 35, 41, 58, 66, 81] },
} as const;

export type CampaignMetric = keyof typeof CAMPAIGN;

/** Barras por semana con selector de métrica; las barras se transforman con resorte al cambiar. */
export function CampaignBars({ height = 210 }: { height?: number }) {
  const renderer = useMotion();
  const dark = useBrandDark();
  const [metric, setMetric] = useState<CampaignMetric>("leads");
  const current = CAMPAIGN[metric];
  const definition = useMemo(() => {
    const paint = brandPaint(dark);
    const rows = current.rows.map((value, index) => ({ week: `S${index + 1}`, value }));
    return defineChart({
      marks: [
        crosshair({ x: { band: { fill: paint.glow, fillOpacity: 0.1, radius: 8, inset: -4 } }, y: false }),
        barY(rows, { x: "week", y: "value", key: "week", fill: "url(#bar-fill)", radius: { end: 4 }, maxThickness: 24 }),
      ],
      scales: {
        x: { scale: () => scaleBand().padding(0.3) },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: { ticks: { count: 4, format: (value: number) => compact.format(value) } },
        },
      },
      gradients: [
        {
          id: "bar-fill",
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0,
          stops: [
            { offset: 0, color: BRAND_MARK, opacity: 0.95 },
            { offset: 1, color: paint.glow, opacity: 1 },
          ],
        },
      ],
      theme: paint.theme,
      tooltip: {
        use: tooltip,
        items: [{ channel: "y", label: current.label, text: (point) => `${whole.format(Number(point.yValue))} ${current.unit}` }],
      },
    });
  }, [current, dark]);

  return (
    <div>
      <div role="tablist" aria-label="Métrica de la campaña" className="flex gap-1 rounded-full bg-fg/[0.06] p-1">
        {(Object.keys(CAMPAIGN) as CampaignMetric[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={metric === key}
            onClick={() => setMetric(key)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${metric === key ? "bg-focus text-navy shadow-[0_0_18px_rgb(43_189_239/0.4)]" : "text-fg/70 hover:text-fg"}`}
          >
            {CAMPAIGN[key].label}
          </button>
        ))}
      </div>
      <ChartStage height={height} tone="brand">
        <Chart key={dark ? "dark" : "light"} definition={definition} renderer={renderer} height={height} idPrefix="campaign" ariaLabel={`${current.label} por semana, datos de ejemplo`} />
      </ChartStage>
    </div>
  );
}
