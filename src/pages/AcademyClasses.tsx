import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Database,
  Flame,
  Megaphone,
  Radio,
  Rocket,
  Users,
} from "lucide-react";
import { BrandVideo } from "../components/BrandVideo";
import { BrandPage, Kicker, VideoSlot } from "../components/Dark";
import { FOCUS_COMMUNITY_URL, SiteFooter, SocialGlyph, WhatsAppChat, openExternal } from "../components/Site";
import { LIVE_SESSIONS, TOPICS, type AcademyClass, type AcademyTopic, type LiveSession, type TopicIcon } from "../content/academyClasses";

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

const ICONS: Record<TopicIcon, Icon> = {
  start: Rocket,
  live: Radio,
  ads: Megaphone,
  capcut: Clapperboard,
  viral: Flame,
  crm: Database,
};

const SECTIONS = [
  { hash: "clases", label: "Clases" },
  { hash: "calendario", label: "Calendario" },
];

const SEEN_KEY = "focus-academy-vistas";

function readSeen(): string[] {
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeSeen(ids: string[]) {
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    // Sin almacenamiento (modo privado): el progreso solo dura esta visita.
  }
}

const ALL_CLASSES = TOPICS.flatMap((topic) => topic.classes.map((item) => ({ topic, item })));

function findClass(id: string) {
  return ALL_CLASSES.find((entry) => entry.item.id === id) ?? ALL_CLASSES[0]!;
}

// ---------- Panel izquierdo: temas y clases ----------

function TopicList({
  activeId,
  seen,
  onPick,
}: {
  activeId: string;
  seen: string[];
  onPick: (id: string) => void;
}) {
  const activeTopic = findClass(activeId).topic.id;
  const [open, setOpen] = useState<string[]>([activeTopic]);
  const reduce = useReducedMotion();

  useEffect(() => {
    setOpen((list) => (list.includes(activeTopic) ? list : [...list, activeTopic]));
  }, [activeTopic]);

  return (
    <nav aria-label="Clases por tema" className="rounded-[26px] border border-fg/10 bg-card/80 p-3 backdrop-blur">
      <p className="px-2 pt-1 pb-3 text-xs font-bold tracking-[0.2em] text-accent-ink uppercase">Clases por tema</p>
      <ul className="grid gap-2">
        {TOPICS.map((topic) => {
          const Glyph = ICONS[topic.icon];
          const expanded = open.includes(topic.id);
          const done = topic.classes.filter((item) => seen.includes(item.id)).length;
          return (
            <li key={topic.id}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`tema-${topic.id}`}
                onClick={() => setOpen((list) => (expanded ? list.filter((id) => id !== topic.id) : [...list, topic.id]))}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition ${
                  topic.id === activeTopic ? "border-[#2bbdef] bg-[#2bbdef]/10" : "border-fg/10 hover:border-[#2bbdef]/50"
                }`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#2ad8ff] to-lime text-navy">
                  <Glyph className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold">{topic.title}</span>
                  <span className="block text-[11px] font-bold text-fg/55">
                    {done}/{topic.classes.length} vistas
                  </span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition ${expanded ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.ul
                    id={`tema-${topic.id}`}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    {topic.classes.map((item) => {
                      const active = item.id === activeId;
                      const watched = seen.includes(item.id);
                      const ready = Boolean(item.video || item.embed);
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => onPick(item.id)}
                            aria-current={active ? "true" : undefined}
                            className={`mt-1 flex w-full items-center gap-2.5 rounded-xl py-2 pr-2 pl-4 text-left text-sm transition ${
                              active ? "bg-[#2bbdef] font-extrabold text-navy" : "text-fg/80 hover:bg-fg/[0.06]"
                            }`}
                          >
                            <span
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                                watched ? "border-lime bg-lime text-navy" : active ? "border-navy/50" : "border-fg/25"
                              }`}
                            >
                              {watched ? <Check className="h-3 w-3" strokeWidth={3.5} /> : null}
                            </span>
                            <span className="min-w-0 flex-1 truncate">{item.title}</span>
                            {item.duration ? <span className={`text-[11px] font-bold ${active ? "text-navy/70" : "text-fg/45"}`}>{item.duration}</span> : null}
                            {!ready ? <span className={`text-[10px] font-bold tracking-wide uppercase ${active ? "text-navy/60" : "text-fg/40"}`}>Pronto</span> : null}
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ---------- Panel central: la clase elegida ----------

function ClassPlayer({ topic, item }: { topic: AcademyTopic; item: AcademyClass }) {
  if (item.video && item.poster) {
    return (
      <div className="hero-video">
        <BrandVideo key={item.id} src={item.video} poster={item.poster} title={item.title} duration={item.duration} />
      </div>
    );
  }
  if (item.embed) {
    return (
      <div className="hero-video aspect-video">
        <iframe
          key={item.id}
          className="h-full w-full"
          src={item.embed}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }
  return <VideoSlot title={`${topic.title} · ${item.title}`} note="Esta clase se publicará muy pronto en este espacio." />;
}

function ClassView({
  activeId,
  seen,
  onPick,
  onToggleSeen,
}: {
  activeId: string;
  seen: string[];
  onPick: (id: string) => void;
  onToggleSeen: (id: string) => void;
}) {
  const { topic, item } = findClass(activeId);
  const index = topic.classes.findIndex((entry) => entry.id === item.id);
  const flat = ALL_CLASSES.findIndex((entry) => entry.item.id === item.id);
  const prev = ALL_CLASSES[flat - 1];
  const next = ALL_CLASSES[flat + 1];
  const watched = seen.includes(item.id);
  const reduce = useReducedMotion();

  return (
    <motion.article
      key={item.id}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-w-0"
    >
      <ClassPlayer topic={topic} item={item} />
      <div className="mt-5 rounded-[26px] border border-fg/10 bg-card/80 p-5 backdrop-blur md:p-6">
        <p className="text-xs font-bold tracking-[0.18em] text-accent-ink uppercase">
          {topic.title} · Clase {index + 1} de {topic.classes.length}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">{item.title}</h2>
        <p className="mt-2 text-fg/75">{item.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleSeen(item.id)}
            aria-pressed={watched}
            className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-extrabold transition ${
              watched ? "border-lime bg-lime text-navy" : "border-fg/20 hover:border-lime"
            }`}
          >
            <Check className="h-4 w-4" strokeWidth={3} />
            {watched ? "Clase vista" : "Marcar como vista"}
          </button>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              disabled={!prev}
              onClick={() => prev && onPick(prev.item.id)}
              className="inline-flex items-center gap-1 rounded-full border-2 border-fg/15 px-3 py-2 text-sm font-bold transition hover:border-[#2bbdef] disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <button
              type="button"
              disabled={!next}
              onClick={() => next && onPick(next.item.id)}
              className="inline-flex items-center gap-1 rounded-full bg-[#2bbdef] px-4 py-2 text-sm font-extrabold text-navy transition hover:-translate-y-0.5 disabled:opacity-35"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ---------- Panel derecho: calendario de clases en vivo ----------

const WEEKDAYS = ["do", "lu", "ma", "mi", "ju", "vi", "sá"];
const monthLabel = new Intl.DateTimeFormat("es", { month: "long", year: "numeric" });
const dayLabel = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" });
const timeLabel = new Intl.DateTimeFormat("es", { hour: "numeric", minute: "2-digit", timeZoneName: "short" });

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function sessionsByDay(sessions: readonly LiveSession[]) {
  const map = new Map<string, LiveSession[]>();
  for (const session of sessions) {
    const key = dayKey(new Date(session.start));
    map.set(key, [...(map.get(key) ?? []), session]);
  }
  return map;
}

function topicTitle(id: string) {
  return TOPICS.find((topic) => topic.id === id)?.title ?? "Clase en vivo";
}

function SessionCard({ session }: { session: LiveSession }) {
  const start = new Date(session.start);
  const end = new Date(start.getTime() + session.minutes * 60_000);
  const now = Date.now();
  const live = now >= start.getTime() - 15 * 60_000 && now <= end.getTime();
  return (
    <li className={`rounded-2xl border p-3 ${live ? "border-lime bg-lime/10" : "border-fg/10 bg-fg/[0.03]"}`}>
      <p className="text-[11px] font-bold tracking-[0.14em] text-accent-ink uppercase">{topicTitle(session.topic)}</p>
      <p className="mt-0.5 text-sm leading-snug font-extrabold">{session.title}</p>
      <p className="mt-1 text-xs text-fg/65 first-letter:uppercase">
        {dayLabel.format(start)} · {timeLabel.format(start)}
      </p>
      {session.link ? (
        <a
          href={session.link}
          target="_blank"
          rel="noreferrer"
          className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold ${live ? "bg-lime text-navy" : "border border-fg/20"}`}
        >
          {live ? "Entrar a la clase en vivo" : "Link de la clase"}
        </a>
      ) : (
        <p className="mt-2 text-[11px] text-fg/50">El link se comparte en la comunidad de WhatsApp.</p>
      )}
    </li>
  );
}

function LiveCalendar() {
  const byDay = useMemo(() => sessionsByDay(LIVE_SESSIONS), []);
  const upcoming = useMemo(
    () => LIVE_SESSIONS.filter((session) => new Date(session.start).getTime() + session.minutes * 60_000 >= Date.now()).sort((a, b) => a.start.localeCompare(b.start)),
    [],
  );
  const today = new Date();
  const firstFocus = upcoming[0] ? new Date(upcoming[0].start) : today;
  const [month, setMonth] = useState(() => new Date(firstFocus.getFullYear(), firstFocus.getMonth(), 1));
  const [selected, setSelected] = useState(() => dayKey(firstFocus));

  const cells = useMemo(() => {
    const start = new Date(month);
    start.setDate(1 - month.getDay());
    return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
  }, [month]);

  const daySessions = byDay.get(selected) ?? [];
  const shift = (step: number) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + step, 1));

  return (
    <section id="calendario" aria-label="Calendario de clases en vivo" className="scroll-mt-32 rounded-[26px] border border-fg/10 bg-card/80 p-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-accent-ink" />
        <p className="flex-1 text-xs font-bold tracking-[0.2em] text-accent-ink uppercase">Clases en vivo</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-base font-extrabold first-letter:uppercase">{monthLabel.format(month)}</p>
        <div className="flex gap-1">
          <button type="button" onClick={() => shift(-1)} aria-label="Mes anterior" className="grid h-8 w-8 place-items-center rounded-full hover:bg-fg/10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => shift(1)} aria-label="Mes siguiente" className="grid h-8 w-8 place-items-center rounded-full hover:bg-fg/10">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-bold text-fg/45 uppercase">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date) => {
          const key = dayKey(date);
          const has = byDay.has(key);
          const inMonth = date.getMonth() === month.getMonth();
          const isToday = key === dayKey(today);
          const isSelected = key === selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              aria-pressed={isSelected}
              aria-label={`${dayLabel.format(date)}${has ? ", hay clase en vivo" : ""}`}
              className={`relative grid aspect-square place-items-center rounded-xl text-sm font-bold transition ${
                isSelected ? "bg-[#2bbdef] text-navy" : has ? "bg-lime/15 text-fg hover:bg-lime/25" : "hover:bg-fg/[0.07]"
              } ${inMonth ? "" : "opacity-35"} ${isToday && !isSelected ? "ring-2 ring-[#2bbdef]" : ""}`}
            >
              {date.getDate()}
              {has ? <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-navy" : "bg-lime"}`} /> : null}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {daySessions.length ? (
          <ul className="grid gap-2">
            {daySessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </ul>
        ) : (
          <div>
            <p className="text-sm text-fg/60">No hay clases en vivo este día.</p>
            {upcoming.length ? (
              <>
                <p className="mt-3 text-[11px] font-bold tracking-[0.16em] text-fg/50 uppercase">Próximas clases</p>
                <ul className="mt-2 grid gap-2">
                  {upcoming.slice(0, 2).map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        )}
      </div>
      <p className="mt-3 text-[11px] text-fg/45">Horarios en la zona horaria de tu dispositivo.</p>
    </section>
  );
}

function CommunityCard() {
  return (
    <div className="rounded-[26px] border-2 border-[#25D366]/60 bg-[#25D366]/10 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
          <Users className="h-5 w-5" />
        </span>
        <p className="text-base leading-tight font-extrabold">Comunidad de WhatsApp</p>
      </div>
      <p className="mt-3 text-sm text-fg/75">Preguntas, respuestas y el link de cada clase en vivo, con el equipo de Focus y otros estudiantes.</p>
      <button
        type="button"
        onClick={() => openExternal(FOCUS_COMMUNITY_URL)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgb(37_211_102/0.35)] transition hover:-translate-y-0.5"
      >
        <SocialGlyph name="WhatsApp" className="h-5 w-5" />
        Entrar a la comunidad
      </button>
    </div>
  );
}

// ---------- Página ----------

/** Área de estudiantes: oculta (sin enlaces desde el sitio y con noindex). */
export function AcademyClasses() {
  const [activeId, setActiveId] = useState(() => TOPICS[0]?.classes[0]?.id ?? "");
  const [seen, setSeen] = useState<string[]>([]);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const openCommunity = useCallback(() => openExternal(FOCUS_COMMUNITY_URL), []);

  useEffect(() => {
    setSeen(readSeen());
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const pick = useCallback((id: string) => {
    setActiveId(id);
    // En celular la clase queda arriba de la lista: sube para verla.
    if (window.matchMedia("(max-width: 1023px)").matches) playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleSeen = useCallback((id: string) => {
    setSeen((list) => {
      const next = list.includes(id) ? list.filter((value) => value !== id) : [...list, id];
      writeSeen(next);
      return next;
    });
  }, []);

  return (
    <BrandPage title="Focus Academy · Clases" sections={SECTIONS}>
      <main id="clases" className="relative z-10 mx-auto max-w-[1440px] scroll-mt-32 px-4 pt-6 pb-16 md:px-6">
        <div className="mb-6 text-center lg:text-left">
          <Kicker>Área de estudiantes</Kicker>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            Tus clases de <span className="text-accent-ink">Focus Academy</span>
          </h1>
        </div>
        <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)_310px]">
          <div ref={playerRef} className="order-1 scroll-mt-32 lg:order-2">
            <ClassView activeId={activeId} seen={seen} onPick={pick} onToggleSeen={toggleSeen} />
          </div>
          <div className="order-2 lg:order-1 lg:row-span-2 xl:sticky xl:top-32 xl:row-span-1">
            <TopicList activeId={activeId} seen={seen} onPick={pick} />
          </div>
          <aside className="order-3 grid items-start gap-5 sm:grid-cols-2 lg:col-start-2 xl:sticky xl:top-32 xl:col-start-3 xl:grid-cols-1">
            <LiveCalendar />
            <CommunityCard />
          </aside>
        </div>
      </main>
      <SiteFooter onWhatsApp={openCommunity} />
      <WhatsAppChat open={whatsappOpen} onOpen={() => setWhatsappOpen(true)} onClose={() => setWhatsappOpen(false)} community />
    </BrandPage>
  );
}
