import { useEffect, useState } from "react";

export function useMenuItemEvents(
  el: HTMLElement | null,
  onActivate?: () => void,
  onDeactivate?: () => void,
) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!el) return;
    const controller = new AbortController();
    const signal = controller.signal;

    el.addEventListener(
      "ln-activate-mouse",
      () => {
        el.focus();
        onActivate?.();
      },
      { signal },
    );
    el.addEventListener(
      "ln-deactivate-mouse",
      () => {
        el.blur();
        onDeactivate?.();
      },
      { signal },
    );

    return () => controller.abort();
  }, [el, onActivate, onDeactivate]);

  return [active, setActive] as const;
}
