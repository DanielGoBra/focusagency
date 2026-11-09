import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";
import { TurnstileField, turnstileSiteKey } from "./TurnstileField";

/** Evento para abrir el formulario desde otro lugar (p. ej. Business GOLD) con un mensaje inicial. */
export const CONTACT_FORM_EVENT = "focus-contact-form";

export function openContactForm(message = "") {
  window.dispatchEvent(new CustomEvent(CONTACT_FORM_EVENT, { detail: message }));
}

/**
 * Formulario por correo para quien no usa WhatsApp (Europa, EE. UU.).
 * Envía a /api/contact, que valida Turnstile y entrega el mensaje con Resend.
 */
export function ContactForm() {
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
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const preset = (event as CustomEvent<string>).detail;
      if (preset) setMessage((current) => (current.trim() ? current : preset));
      setSent(false);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 450);
    };
    window.addEventListener(CONTACT_FORM_EVENT, onOpen);
    return () => window.removeEventListener(CONTACT_FORM_EVENT, onOpen);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();
    if (cleanName.length < 2) return setError("Escribe tu nombre.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return setError("Revisa el correo.");
    if (cleanMessage.length < 8) return setError("Cuéntanos un poco más, aunque sea una frase.");
    if (!token) return setError("Confirma que no eres un robot.");
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, company: company.trim(), message: cleanMessage, token, fax }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
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

  const field =
    "mt-1 w-full rounded-2xl border border-navy/15 bg-[#f4f7fb] px-4 py-3 text-[#14245c] outline-none transition focus:border-focus focus:bg-white focus:ring-4 focus:ring-focus/20";
  const label = "text-[11px] font-bold tracking-[0.14em] text-navy/60";

  return (
    <form
      id="formulario"
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="scroll-mt-28 rounded-[26px] border-2 border-[#2bbdef] bg-white p-6 text-left text-[#14245c] shadow-[0_0_28px_rgb(43_189_239/0.3)] md:p-8"
    >
      {sent ? (
        <div role="status">
          <p className="text-xs font-bold tracking-[0.18em] text-[#1a9fd0]">MENSAJE ENVIADO</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight">Gracias, {name.trim()}.</h3>
          <p className="mt-3 text-navy/75">El equipo de Focus recibió tu mensaje y te responderá a {email.trim()}.</p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setMessage("");
              setCaptchaKey((value) => value + 1);
            }}
            className="mt-6 text-sm font-bold text-[#1a9fd0]"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <div className="relative grid gap-4">
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#1a9fd0]">
            <Mail className="h-4 w-4" />
            ESCRÍBENOS AL CORREO
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>NOMBRE</span>
              <input ref={nameRef} className={field} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
            </label>
            <label className="block">
              <span className={label}>CORREO</span>
              <input className={field} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </label>
          </div>
          <label className="block">
            <span className={label}>EMPRESA (OPCIONAL)</span>
            <input className={field} value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" />
          </label>
          <label className="block">
            <span className={label}>MENSAJE</span>
            <textarea className={`${field} min-h-32 resize-y`} value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} />
          </label>
          <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            Fax
            <input tabIndex={-1} autoComplete="off" value={fax} onChange={(event) => setFax(event.target.value)} />
          </label>
          <TurnstileField key={captchaKey} onToken={rememberToken} />
          {error ? (
            <p role="alert" className="text-sm font-bold text-[#d6283f]">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending || !captchaReady}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-navy px-6 py-3 text-base font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {pending ? "Enviando…" : "Enviar mensaje"}
          </button>
        </div>
      )}
    </form>
  );
}
