import type { Href } from "expo-router";

type RouterLike = {
  canGoBack: () => boolean;
  back: () => void;
  replace: (href: Href) => void;
};

const DEFAULT_FALLBACK = "/(tabs)" as Href;

/**
 * Go back if we can, otherwise go to fallback.
 * Fallback defaults to /(tabs) so you never get stuck on a blank screen.
 */
export function safeBack(router: RouterLike, fallback: Href = DEFAULT_FALLBACK) {
  try {
    if (router.canGoBack()) {
      router.back();
      return;
    }
  } catch {
    // If canGoBack throws, fall through to fallback
  }

  router.replace(fallback);
}