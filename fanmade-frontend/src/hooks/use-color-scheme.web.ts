import { useEffect, useState } from 'react';
import { useLoopaTheme } from '@/lib/loopa-theme';

/**
 * Loopa useColorScheme — Black and White
 * Don't use system scheme. Loopa uses its own mode from lib/loopa-theme.
 * Maps Loopa mode -> RN scheme so old code still works:
 *  "black" -> "dark"
 *  "white" -> "light"
 *
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { mode } = useLoopaTheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return 'dark' as const; // Loopa default is black
  }

  // Loopa mode is "black" | "white", RN expects "dark" | "light"
  return mode === 'white' ? 'light' as const : 'dark' as const;
}