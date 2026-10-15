import { createContext, useContext } from "react";

/** Tema activo de Agency y Academy; lo cambia el botón de luna/sol del header de marcas. */
export const BrandDarkContext = createContext(true);

export function useBrandDark() {
  return useContext(BrandDarkContext);
}
