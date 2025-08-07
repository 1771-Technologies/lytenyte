import { useEffect } from "react";

export function useOnWindowScroll(onScroll: () => void, enabled: boolean) {
  useEffect(() => {
    if (enabled) {
      const cb = onScroll;
      window.addEventListener("scroll", cb, { capture: true, passive: true });
      return () => void window.removeEventListener("scroll", cb, true);
    }
  }, [onScroll, enabled]);
}
