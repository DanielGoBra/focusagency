import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { BrandLogo } from "./Logo";
import { TurnstileField, turnstileSiteKey } from "./TurnstileField";

const WHATSAPP_PHONE = "573106309679";
const WHATSAPP_DRAFT = "Hola, estoy interesado.";

export function focusWhatsAppHref(text: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

const WHATSAPP_URL = focusWhatsAppHref(WHATSAPP_DRAFT);

const SOCIALS = [
  { name: "Instagram", href: "https://www.instagram.com/focuschat.agency/" },
  { name: "Facebook", href: "https://www.facebook.com/share/1DCGzULDUb/?mibextid=wwXIfr" },
  { name: "YouTube", href: "https://www.youtube.com/watch?v=ERUiJeoRlX4" },
  { name: "TikTok", href: "https://www.tiktok.com/@focuschat.agency" },
  { name: "WhatsApp", href: WHATSAPP_URL },
] as const;

export function SocialGlyph({ name, className = "h-6 w-6 sm:h-8 sm:w-8" }: { name: (typeof SOCIALS)[number]["name"]; className?: string }) {
  const props = { viewBox: "0 0 24 24", className, fill: "currentColor", "aria-hidden": true as const };
  if (name === "Instagram") {
    return (
      <svg {...props}>
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.4 6.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  if (name === "Facebook") {
    return (
      <svg {...props}>
        <path d="M14.2 20v-7.1h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.4-1.4H17V4.5A18 18 0 0 0 14.9 4c-2.1 0-3.5 1.3-3.5 3.6v2.5H9v2.8h2.4V20z" />
      </svg>
    );
  }
  if (name === "YouTube") {
    return (
      <svg {...props}>
        <path d="M22 12.2s0-3.2-.4-4.6a3 3 0 0 0-2.1-2.1C17.9 5 12 5 12 5s-5.9 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12.2 2 12.2s0 3.2.4 4.6a3 3 0 0 0 2.1 2.1C6.1 19.4 12 19.4 12 19.4s5.9 0 7.5-.5a3 3 0 0 0 2.1-2.1c.4-1.4.4-4.6.4-4.6zM10 15.2V9.2l5 3z" />
      </svg>
    );
  }
  if (name === "TikTok") {
    return (
      <svg {...props}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V8.99a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.77 1.52V6.83a4.85 4.85 0 0 1-1.01-.14z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.01 4.54-3.69 8.22-8.23 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.29z" />
    </svg>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  from = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "left" | "right" | "zoom";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const motion = {
    up: "slide-in-from-bottom-8",
    left: "slide-in-from-left-10",
    right: "slide-in-from-right-10",
    zoom: "zoom-in-95 slide-in-from-bottom-6",
  }[from];

  return (
    <div
      ref={ref}
      className={`reveal ${className} ${shown ? `animate-in fade-in ${motion} duration-700 fill-mode-both` : "opacity-0"}`}
      style={{ animationDelay: shown ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

export function SocialLinks({ tone = "navy", onWhatsApp }: { tone?: "navy" | "white"; onWhatsApp?: () => void }) {
  const button =
    tone === "white"
      ? "grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-navy"
      : "grid h-9 w-9 place-items-center rounded-full text-navy transition hover:bg-white hover:text-focus sm:h-12 sm:w-12";
  const icon = tone === "white" ? "h-5 w-5" : "h-6 w-6 sm:h-8 sm:w-8";

  return (
    <div className={`flex items-center ${tone === "white" ? "gap-2" : "gap-0.5 sm:gap-3"}`}>
      {SOCIALS.map((item) => (
        <a
          key={item.name}
          href={item.href}
          aria-label={item.name}
          target={item.name === "WhatsApp" ? undefined : item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.name === "WhatsApp" ? undefined : item.href.startsWith("http") ? "noreferrer" : undefined}
          onClick={
            item.name === "WhatsApp" && onWhatsApp
              ? (event) => {
                  event.preventDefault();
                  onWhatsApp();
                }
              : undefined
          }
          className={button}
        >
          <SocialGlyph name={item.name} className={icon} />
        </a>
      ))}
    </div>
  );
}

export function openFocusWhatsApp(text: string) {
  const href = focusWhatsAppHref(text);
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function WhatsAppChat({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  const [draft, setDraft] = useState(WHATSAPP_DRAFT);
  const [sentText, setSentText] = useState<string | null>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    fieldRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim() || WHATSAPP_DRAFT;
    setSentText(text);
    setDraft(WHATSAPP_DRAFT);
    openFocusWhatsApp(text);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {open ? (
        <section
          role="dialog"
          aria-label="Chat de WhatsApp"
          className="flex w-[min(100vw-2.5rem,22rem)] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_rgba(32,34,70,0.28)]"
        >
          <header className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366]">
              <SocialGlyph name="WhatsApp" className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">Focus Agency</span>
              <span className="block text-xs text-white/75">WhatsApp</span>
            </span>
            <button type="button" onClick={onClose} aria-label="Cerrar chat" className="ml-auto grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto bg-[#e7f6ef] px-3 py-4">
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-navy shadow-sm">
              Hola. Soy Focus. Escribe tu mensaje y te abrimos el chat de Focus Agency en WhatsApp.
            </p>
            {sentText ? (
              <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 text-sm text-navy shadow-sm">{sentText}</p>
            ) : null}
          </div>
          <form onSubmit={send} className="flex items-end gap-2 border-t border-navy/10 bg-white px-3 py-3">
            <label className="sr-only" htmlFor="whatsapp-draft">Mensaje</label>
            <textarea
              id="whatsapp-draft"
              ref={fieldRef}
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Escribe un mensaje"
              className="max-h-24 min-h-10 flex-1 resize-none rounded-2xl bg-paper px-3 py-2 text-sm text-navy outline-none"
            />
            <button type="submit" aria-label="Enviar por WhatsApp" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M3.4 11.2 20 4.2c.7-.3 1.4.4 1.1 1.1l-7 16.6c-.3.8-1.4.8-1.7 0l-2.6-6.1-6.1-2.6c-.8-.3-.8-1.4 0-1.7z" />
              </svg>
            </button>
          </form>
        </section>
      ) : null}
      <button
        type="button"
        onClick={open ? onClose : onOpen}
        aria-expanded={open}
        aria-label={open ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d]"
      >
        <SocialGlyph name="WhatsApp" className="h-8 w-8" />
      </button>
    </div>
  );
}

export function ContactForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [fax, setFax] = useState("");
  const [token, setToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const captchaReady = Boolean(turnstileSiteKey());
  const rememberToken = useCallback((value: string) => setToken(value), []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();
    if (cleanName.length < 2) {
      setError("Escribe tu nombre.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Revisa el correo.");
      return;
    }
    if (cleanMessage.length < 8) {
      setError("Cuéntanos un poco más, aunque sea una frase.");
      return;
    }
    if (!token) {
      setError("Confirma que no eres un robot.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, company: company.trim(), message: cleanMessage, token, fax }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "No pudimos enviar el mensaje.");
        setToken("");
        setCaptchaKey((value) => value + 1);
        return;
      }
      setSent(true);
    } catch {
      setError("No pudimos enviar el mensaje. Revisa tu conexión.");
    } finally {
      setPending(false);
    }
  }

  const field = "mt-1 w-full rounded-2xl border border-navy/10 bg-white/75 px-4 py-3 text-navy outline-none backdrop-blur transition focus:border-focus focus:ring-4 focus:ring-focus/20";

  return (
    <section id="contacto" data-tone="light" className={`relative ${dark ? "text-white" : ""}`}>
      {!dark && <div className="absolute inset-0 z-0 bg-[#f4f7fb]" />}
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-[0.85fr_1.15fr]">
        <Reveal from="left">
          <p className={`text-xs font-bold tracking-[0.18em] ${dark ? "text-aqua" : "text-focus"}`}>CONTACTO</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">Contáctanos.</h2>
          <p className={`mt-4 max-w-md text-lg font-light ${dark ? "text-white/70" : "text-navy/75"}`}>
            Cuéntanos qué canal te está trayendo ruido. El mensaje llega al equipo de Focus.
          </p>
        </Reveal>
        <Reveal from="right" delay={120}>
          <form onSubmit={submit} className={`${dark ? "bg-white shadow-[0_30px_80px_rgb(0_0_0/0.35)]" : "glass-card"} rounded-[28px] p-6 text-navy md:p-8`} noValidate>
            {sent ? (
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-focus">MENSAJE REGISTRADO</p>
                <h3 className="mt-2 text-3xl font-extrabold tracking-tight">Gracias, {name.trim()}.</h3>
                <p className="mt-3 text-navy/75">El equipo de Focus recibió tu mensaje y te responde a {email.trim()}.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setMessage("");
                  }}
                  className="mt-6 text-sm font-bold text-focus"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <div className="relative grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] font-bold tracking-[0.14em] text-navy/55">NOMBRE</span>
                    <input className={field} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold tracking-[0.14em] text-navy/55">CORREO</span>
                    <input className={field} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
                  </label>
                </div>
                <label className="block">
                  <span className="text-[11px] font-bold tracking-[0.14em] text-navy/55">EMPRESA</span>
                  <input className={field} value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" />
                </label>
                <label className="block">
                  <span className="text-[11px] font-bold tracking-[0.14em] text-navy/55">MENSAJE</span>
                  <textarea className={`${field} min-h-32 resize-y`} value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} />
                </label>
                <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  Fax
                  <input tabIndex={-1} autoComplete="off" value={fax} onChange={(event) => setFax(event.target.value)} />
                </label>
                <TurnstileField key={captchaKey} onToken={rememberToken} />
                {error && (
                  <p role="alert" className="text-sm font-bold text-navy">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={pending || !captchaReady}
                  className="mt-1 w-fit rounded-full bg-navy px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? "Enviando…" : "Enviar mensaje"}
                </button>
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

const SITES = [
  { to: "/", label: "focuschat" },
  { to: "/agency", label: "focus agency" },
  { to: "/academy", label: "focus academy" },
] as const;

export function SiteSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div data-tone={tone === "dark" ? "navy" : "light"} className={`relative z-40 px-3 pt-3 ${tone === "dark" ? "bg-abyss" : "bg-paper"}`}>
      <nav aria-label="Sitios de Focus" className="mx-auto flex max-w-[1580px] items-center justify-center gap-1 rounded-[22px] bg-iris px-2 py-2 sm:gap-6 md:py-3">
        {SITES.map((site) => (
          <NavLink
            key={site.to}
            to={site.to}
            end
            className={({ isActive }) =>
              `font-soft rounded-full px-3 py-1.5 text-[15px] leading-none font-extrabold tracking-tight text-[#0b0d1f] transition sm:px-5 sm:text-xl md:text-[1.7rem] ${
                isActive ? "bg-white/45 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.6)]" : "hover:bg-white/25"
              }`
            }
          >
            {site.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function SiteFooter({ band = "focus", onWhatsApp }: { band?: "focus" | "aqua"; onWhatsApp?: () => void }) {
  return (
    <>
      <section data-tone="focus" className="relative text-navy">
        <div className={`absolute inset-0 z-0 ${band === "aqua" ? "bg-aqua" : "bg-focus"}`} />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Entra y mueve el negocio de prueba.</h2>
            <p className="mt-3 max-w-xl">Bandeja, pipeline, pauta, flujos e integraciones ya responden en este navegador.</p>
          </div>
          <Link to="/hub" className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-white">
            Entrar al Hub
          </Link>
        </div>
      </section>

      <footer data-tone="navy" className="relative text-white">
        <div className="absolute inset-0 z-0 bg-navy" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <BrandLogo variant="white" className="h-12 w-auto" />
              <p className="mt-4 max-w-xs text-sm text-white/70">Chatbots, automatizaciones y Meta Ads en una sola lectura del cliente.</p>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <SocialLinks tone="white" onWhatsApp={onWhatsApp} />
              <a className="text-sm font-bold" href="https://www.instagram.com/focuschat.agency/">@focuschat.agency</a>
            </div>
          </div>
          <p className="mt-10 border-t border-white/15 pt-6 text-sm text-white/70">© 2026 Focus Agency. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
