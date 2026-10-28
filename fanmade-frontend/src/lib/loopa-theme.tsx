import React from "react";
import { getSavedTheme, saveTheme } from "./theme-storage";
import { getLoopaTheme, type LoopaThemeMode } from "./theme";

type LoopaThemeContextValue = {
  mode: LoopaThemeMode;
  colors: ReturnType<typeof getLoopaTheme>;
  setMode: (mode: LoopaThemeMode) => void;
};

const LoopaThemeContext =
  React.createContext<LoopaThemeContextValue | undefined>(undefined);

export function LoopaThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setModeState] = React.useState<LoopaThemeMode>("black");

  React.useEffect(() => {
    getSavedTheme().then(setModeState).catch(() => {});
  }, []);

  const setMode = React.useCallback((nextMode: LoopaThemeMode) => {
    setModeState(nextMode);
    saveTheme(nextMode).catch(() => {});
  }, []);

  const value = React.useMemo(
    () => ({
      mode,
      colors: getLoopaTheme(mode),
      setMode,
    }),
    [mode, setMode],
  );

  return (
    <LoopaThemeContext.Provider value={value}>
      {children}
    </LoopaThemeContext.Provider>
  );
}

export function useLoopaTheme() {
  const context = React.useContext(LoopaThemeContext);

  if (!context) {
    throw new Error("useLoopaTheme must be used inside LoopaThemeProvider");
  }

  return context;
}
