import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Salta de inmediato. `scroll-behavior: smooth` no debe animar este cambio. */
export function jumpTo(top: number) {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top, left: 0, behavior: "instant" });
  requestAnimationFrame(() => {
    root.style.scrollBehavior = previous;
  });
}

export function routeGroup(pathname: string) {
  return pathname;
}

/** Un ancla queda bajo el header fijo. Si aún no existe, abre arriba. */
export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const target = id ? document.getElementById(id) : null;
  if (!target) {
    jumpTo(0);
    return;
  }
  const header = document.querySelector("header");
  const offset = (header?.getBoundingClientRect().height ?? 0) + 16;
  jumpTo(target.getBoundingClientRect().top + window.scrollY - offset);
}

/**
 * El cambio de marca lo posiciona la página que entra, cuando ya está invisible.
 * Aquí solo se mueve el scroll si la transición no va a desmontar la vista
 * (ancla en la misma página).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prev = useRef(pathname);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    const previous = prev.current;
    prev.current = pathname;
    if (routeGroup(previous) !== routeGroup(pathname)) return;

    if (!hash) {
      if (previous !== pathname) jumpTo(0);
      return;
    }
    scrollToHash(hash);
    const late = window.setTimeout(() => scrollToHash(hash), 80);
    return () => window.clearTimeout(late);
  }, [pathname, hash]);

  return null;
}
