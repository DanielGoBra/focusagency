import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { areaY, barX, barY, crosshair, defineChart, dot, lineY } from "@tanstack/charts";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { motion } from "@tanstack/charts/motion";
import { Chart } from "@tanstack/charts/react/core";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { curveMonotoneX } from "d3-shape";

// Colores validados con el verificador de paletas (banda de luminosidad, contraste y daltonismo).
const DARK_MARK = "#14a89e";
const DARK_GLOW = "#4ef2e4";
const LIGHT_A = "#2b7fc0";
const LIGHT_B = "#4f9a26";

const DARK_THEME = {
  foreground: "rgb(255 255 255 / 0.82)",
  muted: "rgb(255 255 255 / 0.5)",
  grid: "rgb(255 255 255 / 0.08)",
  background: "transparent",
  palette: [DARK_MARK],
};

const LIGHT_THEME = {
  foreground: "#202246",
  muted: "rgb(32 34 70 / 0.6)",
  grid: "rgb(32 34 70 / 0.08)",
  background: "transparent",
  palette: [LIGHT_A, LIGHT_B],
};

const compact = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("es-CO");
const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", notation: "compact", maximumFractionDigits: 1 });

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
function ChartStage({ height, tone, children }: { height: number; tone: "dark" | "light"; children: ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={tone === "dark" ? "chart-dark" : "chart-light"} style={{ minHeight: height }}>
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
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          crosshair({ x: { label: true }, y: false, stroke: DARK_GLOW, strokeOpacity: 0.4, strokeDasharray: "3 4" }),
          areaY(GROWTH, { x: "month", y: "leads", key: "month", fill: "url(#growth-fill)", fillOpacity: 1, curve }),
          lineY(GROWTH, { x: "month", y: "leads", key: "month", stroke: DARK_GLOW, strokeWidth: 2, curve }),
          dot(GROWTH.slice(-1), { x: "month", y: "leads", key: "month", r: 5, fill: DARK_GLOW, stroke: "#081723", strokeWidth: 2 }),
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
              { offset: 0, color: DARK_MARK, opacity: 0 },
              { offset: 1, color: DARK_GLOW, opacity: 0.35 },
            ],
          },
        ],
        theme: DARK_THEME,
        focus: "group-x",
        maxFocusDistance: Number.POSITIVE_INFINITY,
        tooltip: {
          use: tooltip,
          items: [{ channel: "y", label: "Leads", text: (point) => `${whole.format(Number(point.yValue))} leads` }],
        },
      }),
    [],
  );
  return (
    <ChartStage height={height} tone="dark">
      <Chart definition={definition} renderer={renderer} height={height} idPrefix="growth" ariaLabel="Leads calificados por mes, datos de ejemplo" />
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
  const [metric, setMetric] = useState<CampaignMetric>("leads");
  const current = CAMPAIGN[metric];
  const definition = useMemo(() => {
    const rows = current.rows.map((value, index) => ({ week: `S${index + 1}`, value }));
    return defineChart({
      marks: [
        crosshair({ x: { band: { fill: DARK_GLOW, fillOpacity: 0.08, radius: 8, inset: -4 } }, y: false }),
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
            { offset: 0, color: DARK_MARK, opacity: 0.9 },
            { offset: 1, color: DARK_GLOW, opacity: 1 },
          ],
        },
      ],
      theme: DARK_THEME,
      tooltip: {
        use: tooltip,
        items: [{ channel: "y", label: current.label, text: (point) => `${whole.format(Number(point.yValue))} ${current.unit}` }],
      },
    });
  }, [current]);

  return (
    <div>
      <div role="tablist" aria-label="Métrica de la campaña" className="flex gap-1 rounded-full bg-white/[0.05] p-1">
        {(Object.keys(CAMPAIGN) as CampaignMetric[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={metric === key}
            onClick={() => setMetric(key)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${metric === key ? "bg-aqua text-abyss shadow-[0_0_18px_rgb(78_242_228/0.4)]" : "text-white/70 hover:text-white"}`}
          >
            {CAMPAIGN[key].label}
          </button>
        ))}
      </div>
      <ChartStage height={height} tone="dark">
        <Chart definition={definition} renderer={renderer} height={height} idPrefix="campaign" ariaLabel={`${current.label} por semana, datos de ejemplo`} />
      </ChartStage>
    </div>
  );
}

type WeekRow = { day: string; chats: number; qualified: number };

/** Hub · conversaciones de la semana (barras) y calificados (línea), en la misma escala. */
export function WeeklyChatsChart({ rows, height = 260 }: { rows: readonly WeekRow[]; height?: number }) {
  const renderer = useMotion();
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          crosshair({ x: { band: { fill: "#202246", fillOpacity: 0.06, radius: 10, inset: -4 } }, y: false }),
          barY(rows, { x: "day", y: "chats", key: "day", fill: LIGHT_A, radius: { end: 4 }, maxThickness: 24 }),
          lineY(rows, { x: "day", y: "qualified", key: "day", stroke: LIGHT_B, strokeWidth: 2, curve }),
          dot(rows, { x: "day", y: "qualified", key: "day", r: 4, fill: LIGHT_B, stroke: "#ffffff", strokeWidth: 2 }),
        ],
        scales: {
          x: { scale: () => scaleBand().padding(0.3) },
          y: { scale: scaleLinear, nice: true, grid: true, axis: { ticks: { count: 4 } } },
        },
        theme: LIGHT_THEME,
        focus: "group-x",
        maxFocusDistance: Number.POSITIVE_INFINITY,
        tooltip: {
          use: tooltip,
          formatGroup(points) {
            const datum = points[0]?.datum as WeekRow | undefined;
            if (!datum) return "";
            return `${datum.day}\n${datum.chats} conversaciones\n${datum.qualified} calificados`;
          },
        },
      }),
    [rows],
  );
  return (
    <div>
      <ul className="flex flex-wrap gap-4 text-xs font-bold text-navy/70">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-[3px]" style={{ background: LIGHT_A }} />
          Conversaciones
        </li>
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded-full" style={{ background: LIGHT_B }} />
          Calificados
        </li>
      </ul>
      <ChartStage height={height} tone="light">
        <Chart definition={definition} renderer={renderer} height={height} idPrefix="weekly" ariaLabel="Conversaciones y leads calificados por día" />
      </ChartStage>
    </div>
  );
}

type ChannelRow = { channel: string; count: number; value: number };

/** Hub · valor del pipeline por canal en barras horizontales, ordenadas de mayor a menor. */
export function ChannelValueChart({ rows, height = 220 }: { rows: readonly ChannelRow[]; height?: number }) {
  const renderer = useMotion();
  const sorted = useMemo(() => [...rows].sort((a, b) => b.value - a.value), [rows]);
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          crosshair({ y: { band: { fill: "#202246", fillOpacity: 0.06, radius: 10, inset: -4 } }, x: false }),
          barX(sorted, { y: "channel", x: "value", key: "channel", fill: LIGHT_A, radius: { end: 4 }, maxThickness: 24 }),
        ],
        scales: {
          y: { scale: () => scaleBand().padding(0.35) },
          x: { scale: scaleLinear, nice: true, grid: true, axis: { ticks: { count: 4, format: (value: number) => pesos.format(value) } } },
        },
        theme: LIGHT_THEME,
        tooltip: {
          use: tooltip,
          format(point) {
            const datum = point.datum as ChannelRow;
            return `${datum.channel}\n${pesos.format(datum.value)} · ${datum.count} ${datum.count === 1 ? "lead" : "leads"}`;
          },
        },
      }),
    [sorted],
  );
  return (
    <ChartStage height={height} tone="light">
      <Chart definition={definition} renderer={renderer} height={height} idPrefix="channels" ariaLabel="Valor del pipeline por canal" />
    </ChartStage>
  );
}
