export type LoopaThemeMode = "black" | "white";

export const LOOPA_THEMES = {
  black: {
    mode: "black" as const,
    background: "#000000",
    surface: "rgba(0,0,0,0.35)",
    surfaceStrong: "#111111",
    border: "rgba(255,255,255,0.30)",
    text: "#FFFFFF",
    textSecondary: "#AAAAAA",
    textMuted: "#888888",
    inverseBackground: "#FFFFFF",
    inverseText: "#000000",
    // Liquid + Glass
    glassBackground: "rgba(0,0,0,0.35)",
    glassBorder: "rgba(255,255,255,0.30)",
    glassHighlight: "rgba(255,255,255,0.70)",
    glassShadow: "rgba(255,255,255,0.10)",
    glassGradientStart: "rgba(255,255,255,0.18)",
    glassGradientEnd: "rgba(0,0,0,0.55)",
  },
  white: {
    mode: "white" as const,
    background: "#FFFFFF",
    surface: "rgba(255,255,255,0.65)",
    surfaceStrong: "#F0F0F3",
    border: "rgba(0,0,0,0.12)",
    text: "#000000",
    textSecondary: "#60646C",
    textMuted: "#999999",
    inverseBackground: "#000000",
    inverseText: "#FFFFFF",
    // Liquid + Glass
    glassBackground: "rgba(255,255,255,0.65)",
    glassBorder: "rgba(0,0,0,0.12)",
    glassHighlight: "rgba(255,255,255,0.80)",
    glassShadow: "rgba(0,0,0,0.12)",
    glassGradientStart: "rgba(255,255,255,0.35)",
    glassGradientEnd: "rgba(255,255,255,0.05)",
  },
} as const;

export function getLoopaTheme(mode: LoopaThemeMode) {
  return LOOPA_THEMES[mode];
}