import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LoopaThemeMode } from "./theme";

const THEME_STORAGE_KEY = "@loopa/theme";

export async function getSavedTheme(): Promise<LoopaThemeMode> {
  const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);

  if (saved === "white") {
    return "white";
  }

  return "black";
}

export async function saveTheme(theme: LoopaThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
}
