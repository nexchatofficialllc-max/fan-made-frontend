import type { Href } from "expo-router";

type RouterLike = {
  canGoBack: () => boolean;
  back: () => void;
  replace: (href: Href) => void;
};

export function safeBack(router: RouterLike, fallback: Href) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallback);
}
