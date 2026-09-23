export function cop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function num(value: number) {
  return new Intl.NumberFormat("es-CO").format(value);
}

export function clock(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function cpl(spend: number, leads: number) {
  if (!leads) return 0;
  return spend / leads;
}

export function roas(revenue: number, spend: number) {
  if (!spend) return 0;
  return revenue / spend;
}

export function ctr(clicks: number, impressions: number) {
  if (!impressions) return 0;
  return (clicks / impressions) * 100;
}
