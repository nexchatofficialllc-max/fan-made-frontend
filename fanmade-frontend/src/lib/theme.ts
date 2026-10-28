export type LoopaThemeMode = "black" | "white";

export const LOOPA_THEMES = {
  black: {
    mode: "black" as const,
    background: "#07112F",
    surface: "#102A83",
    surfaceStrong: "#17378F",
    border: "rgba(0,217,255,0.24)",
    text: "#FFFFFF",
    textSecondary: "#C2D4F5",
    textMuted: "#91A8D6",
    inverseBackground: "#00D9FF",
    inverseText: "#07112F",
  },
  white: {
    mode: "white" as const,
    background: "#07112F",
    surface: "#102A83",
    surfaceStrong: "#17378F",
    border: "rgba(0,217,255,0.24)",
    text: "#FFFFFF",
    textSecondary: "#C2D4F5",
    textMuted: "#91A8D6",
    inverseBackground: "#00D9FF",
    inverseText: "#07112F",
  },
} as const;

export function getLoopaTheme(mode: LoopaThemeMode) {
  return LOOPA_THEMES[mode];
}
