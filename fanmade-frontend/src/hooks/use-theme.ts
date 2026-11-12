/**
 * Loopa useTheme — Black and White Liquid + Glass
 * Don't use system light/dark. Loopa uses its own mode: "black" | "white"
 * from lib/loopa-theme. This hook just forwards it so old code
 * `const theme = useTheme()` still works.
 */

import { useLoopaTheme } from "@/lib/loopa-theme";

export function useTheme() {
  const { mode, colors, setMode } = useLoopaTheme();

  return {
    // Loopa mode: "black" | "white"
    mode,
    theme: mode,
    setMode,
    setTheme: setMode,
    isWhite: mode === "white",
    isBlack: mode === "black",

    // Colors — same shape old code expects, but Loopa values
    ...colors,

    // Aliases so old template code doesn't break
    background: colors.background,
    text: colors.text,
    textSecondary: colors.textSecondary,
    textMuted: colors.textMuted,
    surface: colors.surface,
    surfaceStrong: colors.surfaceStrong,
    border: colors.border,

    // Loopa glass helpers
    glass: {
      card: "rgba(0,0,0,0.35)",
      cardBorder: "rgba(255,255,255,0.30)",
      reflection: "rgba(255,255,255,0.70)",
      gradient: [
        "rgba(255,255,255,0.16)",
        "rgba(255,255,255,0.04)",
        "rgba(0,0,0,0.50)",
      ] as const,
    },
  };
}