import type { FocusPosition } from "@1771technologies/grid-types/core";
import { signal } from "@1771technologies/react-cascada";

export function cellFocusQueue() {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const s = signal<FocusPosition | null>(null, {
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
