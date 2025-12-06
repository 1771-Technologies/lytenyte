import { useEffect, useMemo, useState } from "react";
import { onAnimationFinished } from "@1771technologies/lytenyte-shared";

export type Transitioned = "idle" | "closing" | "opening";

export function useTransitioned(open: boolean, el: HTMLElement | null): [Transitioned, boolean] {
  const [m, setM] = useState(open);
  const t = useMemo(() => {
    if (open && !m) return "opening";
    if (!open && m) return "closing";
    return "idle";
  }, [m, open]);

  useEffect(() => {
    if ((!open && !m) || (m && open)) return;
    if (open && !m) requestAnimationFrame(() => setM(open));
    if (!open && m) {
      const controller = new AbortController();
      if (!el) return;

      onAnimationFinished({
        element: el,
        fn: () => {
          setM(false);
        },
        signal: controller.signal,
      });

      return () => controller.abort();
    }
  }, [el, m, open]);
  const shouldMount = open || m;

  return [t, shouldMount];
}
