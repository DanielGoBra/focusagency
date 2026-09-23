declare const process: { env: Record<string, string | undefined> };

const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
};

function text(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

function validEmail(value: string) {
  return value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function readContact(body: unknown): { data: ContactPayload; honeypot: string; token: string } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Revisa los datos." };
  const raw = body as Record<string, unknown>;
  const name = text(raw.name, 80);
  const email = text(raw.email, 120);
  const company = text(raw.company, 80);
  const message = text(raw.message, 2000);
  const token = text(raw.token, 2048);
  const honeypot = text(raw.fax, 200);
  if (name.length < 2 || !validEmail(email) || message.length < 8) return { error: "Revisa los datos." };
  return { data: { name, email, company, message }, honeypot, token };
}

async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY || (process.env.NODE_ENV === "production" ? "" : TURNSTILE_TEST_SECRET);
  if (!secret || !token) return false;
  const form = new URLSearchParams({ secret, response: token });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!response.ok) return false;
  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}

async function sendEmail(entry: ContactPayload) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "focusacademy.agency@gmail.com";
  const from = process.env.CONTACT_FROM || "Focus Agency <hola@focuschat.co>";
  if (!key || !from) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: entry.email,
      subject: `Contacto web: ${entry.name}`,
      text: [`Nuevo contacto desde focuschat.co`, "", `Nombre: ${entry.name}`, `Correo: ${entry.email}`, `Empresa: ${entry.company || "—"}`, "", entry.message].join("\n"),
    }),
  });
  return response.ok;
}

async function sendSheet(entry: ContactPayload) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK;
  if (!url) return false;
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.GOOGLE_SHEET_SECRET) headers["x-focus-secret"] = process.env.GOOGLE_SHEET_SECRET;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...entry, at: new Date().toISOString() }),
  });
  return response.ok;
}

export async function handleContact(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Método no permitido." }, { status: 405 });
  }
  const raw = await request.text();
  if (raw.length > 20000) return Response.json({ error: "El mensaje es demasiado largo." }, { status: 400 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Revisa los datos." }, { status: 400 });
  }
  const parsed = readContact(body);
  if ("error" in parsed) return Response.json({ error: parsed.error }, { status: 400 });
  if (parsed.honeypot) return Response.json({ ok: true });
  const human = await verifyTurnstile(parsed.token);
  if (!human) return Response.json({ error: "Confirma que no eres un robot." }, { status: 400 });

  const emailReady = Boolean(process.env.RESEND_API_KEY);
  const sheetReady = Boolean(process.env.GOOGLE_SHEET_WEBHOOK);
  if (!emailReady && !sheetReady) {
    return Response.json({ error: "El buzón del equipo todavía no está conectado." }, { status: 503 });
  }

  const delivered = await Promise.all([emailReady ? sendEmail(parsed.data) : Promise.resolve(true), sheetReady ? sendSheet(parsed.data) : Promise.resolve(true)]);
  if (delivered.some((ok) => !ok)) {
    return Response.json({ error: "No pudimos enviar el mensaje. Inténtalo de nuevo." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
