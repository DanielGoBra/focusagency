import { useColorScheme } from "react-native";

// Mismos tokens que la web (apps/web/src/index.css).
const light = {
  bg: "#f6f7f9",
  surface: "#ffffff",
  surface2: "#f0f2f5",
  border: "#e3e6eb",
  ink: "#14161f",
  ink2: "#4b5160",
  ink3: "#6f7686",
  brand: "#1f8a4c",
  brandInk: "#ffffff",
  brandSoft: "#e6f4ec",
  chart: "#2a78d6",
  danger: "#c2372f",
  dangerSoft: "#fbebea",
  warning: "#9a5b00",
  warningSoft: "#fdf3e2",
};

const dark: typeof light = {
  bg: "#0e1015",
  surface: "#161922",
  surface2: "#1d212c",
  border: "#2a2f3b",
  ink: "#eef0f4",
  ink2: "#b4bac6",
  ink3: "#8a91a0",
  brand: "#3dbb6f",
  brandInk: "#06240f",
  brandSoft: "#143222",
  chart: "#3987e5",
  danger: "#f0605a",
  dangerSoft: "#3a1a19",
  warning: "#f0a640",
  warningSoft: "#3a2a12",
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === "dark" ? dark : light;
}

export const radius = { md: 12, lg: 16, xl: 24 };
export const space = (n: number) => n * 4;
