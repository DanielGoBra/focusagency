import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/** FOCU flota con un balanceo corto, sin pedirle nada a quien mira. */
export function FocuMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -8, 0], rotate: [-1.4, 1.4, -1.4] }}
      transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
