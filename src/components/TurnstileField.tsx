import { useEffect, useRef } from "react";

const TEST_SITE_KEY = "3x00000000000000000000FF";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function turnstileSiteKey() {
  const configured = import.meta.env.VITE_TURNSTILE_SITE_KEY || import.meta.env.TURNSTILE_SITE_KEY;
  if (configured) return configured;
  return import.meta.env.DEV ? TEST_SITE_KEY : "";
}

export function TurnstileField({ onToken }: { onToken: (token: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const siteKey = turnstileSiteKey();

  useEffect(() => {
    if (!siteKey || !host.current) return;
    let widgetId = "";
    let cancelled = false;
    const mount = () => {
      if (cancelled || widgetId || !host.current || !window.turnstile) return;
      widgetId = window.turnstile.render(host.current, {
        sitekey: siteKey,
        theme: "light",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    let script = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
    if (!script) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.dataset.turnstile = "true";
      document.head.appendChild(script);
    }
    script.addEventListener("load", mount);
    const retry = window.setInterval(mount, 300);
    mount();
    return () => {
      cancelled = true;
      window.clearInterval(retry);
      script?.removeEventListener("load", mount);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken, siteKey]);

  if (!siteKey) {
    return <p className="text-sm font-bold text-navy">La verificación no está disponible.</p>;
  }

  return <div ref={host} className="min-h-16" />;
}
