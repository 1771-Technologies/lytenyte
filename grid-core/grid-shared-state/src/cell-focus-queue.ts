import type { PositionFocusCore } from "@1771technologies/grid-types/core";
import { signal, type Signal } from "@1771technologies/react-cascada";

export function cellFocusQueue(): Signal<PositionFocusCore | null> {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const s = signal<PositionFocusCore | null>(null, {
    postUpdate: () => {
      if (timeout) return;

      timeout = setTimeout(() => {
        if (s.peek()) return;
        s.set(null);
        timeout = null;
      }, 5);
    },
  });

  return s;
}
