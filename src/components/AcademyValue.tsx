import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const usd = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

/**
 * Precio de una clase: aparece grande, una línea roja lo tacha y cae el sello GRATIS.
 * `order` escalona la secuencia entre tarjetas.
 */
export function PriceStrike({ value, order = 0 }: { value: number; order?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.7 });
  const on = reduce || seen;
  const lag = reduce ? 0 : 0.35 + order * 0.32;

  return (
    <div ref={ref} className="relative flex h-[88px] w-full flex-col items-center justify-start" aria-label={`Antes ${usd.format(value)} USD, ahora gratis`}>
      <p className="text-[11px] font-bold tracking-[0.16em] text-fg/55 uppercase">Valor real</p>
      <motion.div
        className="relative mt-0.5"
        initial={false}
        animate={on ? { opacity: 0.78, scale: 0.94 } : { opacity: 1, scale: 1 }}
        transition={{ delay: lag + 0.45, duration: 0.35 }}
      >
        <span className="text-[1.8rem] leading-none font-extrabold tracking-tight whitespace-nowrap xl:text-[2.05rem]">
          ${usd.format(value)}
          <span className="ml-1 text-xs font-bold">USD</span>
        </span>
        <motion.span
          aria-hidden
          className="absolute top-1/2 -right-1 -left-1 h-[4px] origin-left -rotate-[8deg] rounded-full bg-[#ff3b55] shadow-[0_0_10px_rgb(255_59_85/0.8)]"
          initial={{ scaleX: reduce ? 1 : 0 }}
          animate={{ scaleX: on ? 1 : 0 }}
          transition={{ delay: lag, duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
        />
      </motion.div>
      <motion.span
        className="absolute bottom-0 rounded-xl bg-lime px-3 py-1 text-lg leading-none font-black tracking-wide text-navy shadow-[0_0_26px_rgb(30_250_93/0.65)]"
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 2.6, rotate: -6 }}
        animate={on ? { opacity: 1, scale: 1, rotate: -6 } : {}}
        transition={{ delay: lag + 0.6, type: "spring", stiffness: 420, damping: 16 }}
      >
        GRATIS
      </motion.span>
    </div>
  );
}

type Item = { title: string; value: number };

function Burst({ run }: { run: number }) {
  const bits = Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2;
    const reach = 110 + (index % 3) * 34;
    return { x: Math.cos(angle) * reach, y: Math.sin(angle) * reach * 0.62, color: index % 3 === 0 ? "#2bbdef" : index % 3 === 1 ? "#1efa5d" : "#ffffff" };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2">
      {bits.map((bit, index) => (
        <motion.span
          key={`${run}-${index}`}
          className="absolute h-2.5 w-2.5 rounded-full"
          style={{ background: bit.color, boxShadow: `0 0 12px ${bit.color}` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: bit.x, y: bit.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/**
 * Calculadora de ahorro: suma el valor de las clases que la persona marca, lo tacha
 * y aterriza en $0. Termina en los planes del CRM, que es lo que se paga.
 */
export function SavingsCalculator({ items, planFrom }: { items: readonly Item[]; planFrom: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  const [picked, setPicked] = useState<boolean[]>(() => items.map(() => Boolean(reduce)));
  const [settled, setSettled] = useState(Boolean(reduce));
  const [burst, setBurst] = useState(0);
  const total = items.reduce((sum, item, index) => sum + (picked[index] ? item.value : 0), 0);
  const all = items.reduce((sum, item) => sum + item.value, 0);

  const counter = useMotionValue(reduce ? all : 0);
  const label = useTransform(counter, (value) => `$${usd.format(Math.round(value))}`);

  useEffect(() => {
    const controls = animate(counter, total, { duration: reduce ? 0 : 0.7, ease: "easeOut" });
    return () => controls.stop();
  }, [counter, total, reduce]);

  // Al entrar en pantalla marca las clases una por una y luego revela el $0.
  useEffect(() => {
    if (!seen || reduce) return;
    const timers = items.map((_, index) =>
      window.setTimeout(() => setPicked((list) => list.map((value, i) => (i === index ? true : value))), 350 + index * 420),
    );
    timers.push(
      window.setTimeout(() => {
        setSettled(true);
        setBurst((value) => value + 1);
      }, 350 + items.length * 420 + 650),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [seen, reduce, items]);

  function toggle(index: number) {
    setPicked((list) => list.map((value, i) => (i === index ? !value : value)));
    setBurst((value) => value + 1);
  }

  const count = picked.filter(Boolean).length;

  return (
    <div ref={ref} className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border-2 border-[#2bbdef] bg-card p-5 shadow-[0_0_40px_rgb(43_189_239/0.25)] md:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-lime/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-focus/15 blur-3xl" />

      <div className="relative grid gap-8 md:grid-cols-[1fr_1.05fr] md:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-accent-ink uppercase">
            <Sparkles className="h-4 w-4" />
            Calcula tu ahorro
          </p>
          <h3 className="mt-3 text-2xl leading-tight font-extrabold tracking-tight md:text-3xl">¿Cuánto pagarías por estos cursos por fuera?</h3>
          <p className="mt-2 text-sm text-fg/70">Toca un curso para sumarlo o quitarlo.</p>
          <ul className="mt-5 grid gap-2">
            {items.map((item, index) => {
              const on = picked[index];
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(index)}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition duration-300 ${
                      on ? "border-lime bg-lime/10" : "border-fg/15 bg-fg/[0.03] hover:border-focus/50"
                    }`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition ${on ? "bg-lime text-navy" : "border-2 border-fg/25"}`}>
                      {on ? <Check className="h-4 w-4" strokeWidth={3.4} /> : null}
                    </span>
                    <span className="flex-1 text-sm font-bold md:text-base">{item.title}</span>
                    <span className={`text-sm font-extrabold whitespace-nowrap md:text-base ${on ? "" : "text-fg/45"}`}>${usd.format(item.value)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative flex flex-col items-center text-center">
          <Burst run={burst} />
          <p className="text-xs font-bold tracking-[0.2em] text-fg/60 uppercase">
            {count} {count === 1 ? "curso" : "cursos"} por fuera
          </p>
          <div className="relative mt-2">
            <motion.p
              className="text-[3.4rem] leading-none font-black tracking-tight sm:text-7xl"
              animate={settled ? { opacity: 0.7, scale: 0.86 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.span>{label}</motion.span>
              <span className="ml-1 text-lg font-extrabold sm:text-2xl">USD</span>
            </motion.p>
            <motion.span
              aria-hidden
              className="absolute top-1/2 -right-3 -left-3 h-[6px] origin-left -rotate-[7deg] rounded-full bg-[#ff3b55] shadow-[0_0_16px_rgb(255_59_85/0.85)]"
              initial={false}
              animate={{ scaleX: settled ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>

          <AnimatePresence>
            {settled ? (
              <motion.div
                key="free"
                className="mt-4"
                initial={{ opacity: 0, y: 24, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.25 }}
              >
                <p className="text-sm font-extrabold tracking-[0.18em] text-fg/70 uppercase">Con Focus Academy pagas</p>
                <p className="mt-1 inline-block rounded-3xl bg-lime px-6 py-1 text-6xl leading-tight font-black text-navy shadow-[0_0_44px_rgb(30_250_93/0.6)] sm:text-7xl">
                  $0
                </p>
                <p className="mt-3 text-base font-bold text-fg/85">
                  Te ahorras <span className="text-lime-ink">${usd.format(total)} USD</span> en formación.
                </p>
              </motion.div>
            ) : (
              <motion.p key="wait" className="mt-6 text-sm text-fg/55" exit={{ opacity: 0 }}>
                Sumando lo que vale aprender por tu cuenta…
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-6 w-full rounded-2xl border border-fg/10 bg-fg/[0.04] p-4">
            <p className="text-sm text-fg/80">
              Solo pagas tu suscripción a <strong className="text-accent-ink">Focus Chat</strong>, el CRM que organiza y convierte tus leads, desde{" "}
              <strong>{planFrom} USD/mes</strong>. Las clases vienen incluidas.
            </p>
            <Link
              to="/#planes"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-focus px-6 py-3 text-base font-extrabold text-navy shadow-[0_0_28px_rgb(43_189_239/0.45)] transition hover:-translate-y-0.5"
            >
              Ver planes de Focus Chat
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
