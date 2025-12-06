import { useEffect, useState } from "react";

export function useMenuItemEvents(
  el: HTMLElement | null,
  onActivate?: () => void,
  onDeactivate?: () => void
) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!el) return;
    const controller = new AbortController();
    const signal = controller.signal;

    el.addEventListener(
      "ln-activate-mouse",
      () => {
        const elementToFocus =
          el.getAttribute("data-ln-combo") === "true"
            ? (el.querySelector('[data-ln-combomenu-input="true"]') as HTMLElement) ?? el
            : el;

        if (elementToFocus === document.activeElement) return;
        elementToFocus.focus();
        onActivate?.();
      },
      { signal }
    );
    el.addEventListener(
      "ln-deactivate-mouse",
      () => {
        el.blur();
        onDeactivate?.();
      },
      { signal }
    );

    return () => controller.abort();
  }, [el, onActivate, onDeactivate]);

  return [active, setActive] as const;
}
