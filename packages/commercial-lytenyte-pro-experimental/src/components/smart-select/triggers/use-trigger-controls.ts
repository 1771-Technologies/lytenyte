import { useMemo, type JSX } from "react";
import { useSmartSelect } from "../context.js";

export function useSelectControls() {
  const { open, onOpenChange, openOnClick, setActiveId, container } = useSmartSelect();

  return useMemo(() => {
    return {
      onClick: () => {
        if (!open && openOnClick) onOpenChange(true);
      },
      onKeyDown: (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();

          if (!open) {
            onOpenChange(true);
            return;
          }

          const active = container?.querySelector('[data-ln-active="true"]') as HTMLElement;
          if (!active) return;

          active.click();

          return;
        }

        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          if (open) onOpenChange(false);
          return;
        }

        if (e.key === "ArrowDown" && !open) {
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(true);
          return;
        }

        if (!open || !container) return;

        if (e.key === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();

          const active = container.querySelector('[data-ln-active="true"]');

          let current = active?.previousElementSibling;
          while (current && current.getAttribute("data-ln-selectable") === "false")
            current = current.previousElementSibling;

          if (!current) {
            current = container.lastElementChild;

            while (current && current.getAttribute("data-ln-selectable") === "false")
              current = current.previousElementSibling;
          }

          if (current) setActiveId(current.getAttribute("data-ln-smart-option"));

          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          e.stopPropagation();

          const active = container.querySelector('[data-ln-active="true"]');
          let current = active?.nextElementSibling;
          while (current && current.getAttribute("data-ln-selectable") === "false")
            current = current.nextElementSibling;

          if (!current) {
            current = container.firstElementChild;

            while (current && current.getAttribute("data-ln-selectable") === "false")
              current = current.nextElementSibling;
          }

          if (current) setActiveId(current.getAttribute("data-ln-smart-option"));

          return;
        }
      },
    } satisfies JSX.IntrinsicElements["button"];
  }, [container, onOpenChange, open, openOnClick, setActiveId]);
}
