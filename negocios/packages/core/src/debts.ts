import { formatMoney } from "./money";

/** Deja solo dígitos y agrega el indicativo 57 a los celulares colombianos de 10 dígitos. */
export function normalizePhone(phone: string, country = "CO"): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (country === "CO" && digits.length === 10 && digits.startsWith("3")) return `57${digits}`;
  return digits;
}

export function reminderMessage(input: {
  businessName: string;
  contactName: string;
  balance: number;
  currency: string;
}): string {
  const firstName = input.contactName.trim().split(/\s+/)[0] ?? input.contactName;
  return (
    `Hola ${firstName}, te saluda ${input.businessName}. ` +
    `Te recordamos que tienes un saldo pendiente de ${formatMoney(input.balance, input.currency)}. ` +
    `Cuando puedas, nos avisas por aquí. ¡Gracias!`
  );
}

/** Enlace wa.me que abre WhatsApp con el mensaje listo. Sin teléfono, deja elegir el chat. */
export function whatsappLink(text: string, phone?: string | null, country = "CO"): string {
  const number = phone ? normalizePhone(phone, country) : null;
  return `https://wa.me/${number ?? ""}?text=${encodeURIComponent(text)}`;
}
