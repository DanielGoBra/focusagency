import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { preloadBrands } from "../brandPreload";
import { jumpTo, routeGroup, scrollToHash } from "./ScrollToTop";

/**
 * Fundido de página de Motion (`AnimatePresence`, modo `wait`):
 * la vista actual sale y la siguiente entra al terminar, sin un corte seco.
 * Ease de salida acelerada y de entrada suave, el par que documenta Motion
 * para que las dos fases se sientan como un solo ease-in-out.
 */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

function EnterScroll({ hash }: { hash: string }) {
  useLayoutEffect(() => {
    if (!hash) {
      jumpTo(0);
      return;
    }
    scrollToHash(hash);
    const late = window.setTimeout(() => scrollToHash(hash), 80);
    return () => window.clearTimeout(late);
  }, [hash]);

  return null;
}

export function PageFade({ children }: { children: (location: ReturnType<typeof useLocation>) => ReactNode }) {
  const location = useLocation();
  const reduce = useReducedMotion() === true;
  const group = routeGroup(location.pathname);

  useEffect(() => {
    const warm = window.setTimeout(preloadBrands, 600);
    return () => window.clearTimeout(warm);
  }, []);

  return (
    <div className="min-h-screen bg-[#071428]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={group}
          data-page-fade={group}
          className="min-h-screen"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.48, ease: EASE_OUT } }}
          exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.32, ease: EASE_IN } }}
        >
          <EnterScroll hash={location.hash} />
          {children(location)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
