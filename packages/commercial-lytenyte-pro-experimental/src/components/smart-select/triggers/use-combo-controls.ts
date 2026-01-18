import { useMemo, useRef, type Dispatch, type JSX, type SetStateAction } from "react";
import { useSmartSelect } from "../context.js";

export function useComboControls(setActiveChip: Dispatch<SetStateAction<string | null>>, isMulti: boolean) {
  const {
    query,
    open,
    openOnClick,
    preventNextOpen,
    onOpenChange,
    setActiveId,
    container,
    onQueryChange,
    trigger,
  } = useSmartSelect();

  const direction = useRef(null as unknown as string);
  return useMemo(() => {
    return {
      onClick: () => {
        if (!open && openOnClick && !preventNextOpen.current) {
          onOpenChange(true);
        }
      },
      onFocus: () => {
        setActiveChip(null);
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

        if (e.key === "Enter") {
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

        if (isMulti && query.length === 0) {
          if (!direction.current) {
            direction.current = getComputedStyle(e.target as HTMLElement).direction;
          }
          const key = direction.current === "ltr" ? "ArrowLeft" : "ArrowRight";

          if (e.key === key) {
            const chips = Array.from(
              trigger!.querySelectorAll("[data-ln-smart-select-chip]"),
            ) as HTMLElement[];

            const first = chips.at(-1);
            if (!first) return;

            first.focus();
            onOpenChange(false);
            setActiveChip(first.getAttribute("data-ln-smart-select-chip"));
            return;
          }
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
    } satisfies JSX.IntrinsicElements["input"];
  }, [
    container,
    isMulti,
    onOpenChange,
    onQueryChange,
    open,
    openOnClick,
    preventNextOpen,
    query,
    setActiveChip,
    setActiveId,
    trigger,
  ]);
}
