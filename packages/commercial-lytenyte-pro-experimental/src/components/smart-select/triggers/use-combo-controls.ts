import { useMemo, type JSX } from "react";
import { useSmartSelect } from "../context.js";

export function useComboControls() {
  const { query, open, onOpenChange, setActiveId, container, onQueryChange } = useSmartSelect();

  return useMemo(() => {
    return {
      onClick: () => {
        if (!open) {
          onOpenChange(true);
        }
      },
      value: query,
      onChange: (ev) => {
        onQueryChange(ev.target.value);
        if (!open) onOpenChange(true);
      },
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          if (open) onOpenChange(false);
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

          if (!open) {
            onOpenChange(true);
            return;
          }

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
    } satisfies JSX.IntrinsicElements["input"];
  }, [container, onOpenChange, onQueryChange, open, query, setActiveId]);
}
