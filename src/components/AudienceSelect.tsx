import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FocuMotion } from "./FocuMotion";
import { Check, X } from "lucide-react";

const PUBLICS = [
  { label: "Alto poder adquisitivo", keep: true, place: "left-[2%] top-[6%]" },
  { label: "Intención de compra", keep: true, place: "right-[2%] top-[10%]" },
  { label: "Les gustan los autos", keep: false, place: "left-0 top-[40%]" },
  { label: "Sin intención de compra", keep: false, place: "right-0 top-[44%]" },
  { label: "Listos para comprar", keep: true, place: "left-[8%] bottom-[6%]" },
  { label: "Solo curiosos", keep: false, place: "right-[6%] bottom-[8%]" },
] as const;

function Card({ label, keep, live }: { label: string; keep: boolean; live: boolean }) {
  const tone = !live
    ? "border-white/15 bg-[#0c1f3d]/80 text-white"
    : keep
      ? "border-[#1efa5d] bg-[#1efa5d] text-[#071428] shadow-[0_0_24px_rgb(30_250_93/0.45)]"
      : "border-[#ff5a6a] bg-[#ff5a6a] text-white shadow-[0_0_24px_rgb(255_90_106/0.4)]";
  return (
    <motion.div
      layout
      animate={{ scale: live ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`flex w-full max-w-none items-center gap-2 rounded-2xl border px-3 py-2 text-left text-xs font-bold sm:text-sm md:w-auto md:max-w-[11.5rem] ${tone}`}
    >
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${live ? "bg-white/20" : "bg-white/10"}`}>
        {live ? keep ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <X className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
      {label}
    </motion.div>
  );
}

/** Focu en el centro elige públicos en verde y descarta otros en rojo; en móvil queda arriba y señala hacia la lista. */
export function AudienceSelect() {
  const reduce = useReducedMotion();
  const [cursor, setCursor] = useState(reduce ? PUBLICS.length : -1);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setCursor((value) => (value + 1) % (PUBLICS.length + 1)), 1100);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="rounded-[28px] border border-[#3ef3ff]/25 bg-[#071428]/80 p-4 shadow-[0_0_40px_rgb(62_243_255/0.08)]">
      <p className="text-center text-[11px] font-bold tracking-[0.18em] text-[#3ef3ff] uppercase">Ejemplo de públicos</p>
      <div className="relative mt-3 hidden h-[430px] md:block">
        <div className="pointer-events-none absolute top-[8%] left-1/2 w-40 -translate-x-1/2">
          <FocuMotion>
            <img src="/brand/mascot/senala.png?v=8" alt="" className="w-full object-contain" />
          </FocuMotion>
        </div>
        {PUBLICS.map((item, index) => (
          <div key={item.label} className={`absolute ${item.place}`}>
            <Card label={item.label} keep={item.keep} live={cursor >= index && cursor < PUBLICS.length} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col items-center gap-3 md:hidden">
        <FocuMotion className="w-36">
          <img src="/brand/mascot/senala-abajo.png" alt="" className="w-full object-contain" />
        </FocuMotion>
        <ul className="grid w-full gap-2">
          {PUBLICS.map((item, index) => (
            <li key={item.label}>
              <Card label={item.label} keep={item.keep} live={cursor >= index && cursor < PUBLICS.length} />
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 text-center text-sm text-white/70">Focu se queda con los públicos en verde y descarta los que no compran.</p>
    </div>
  );
}
