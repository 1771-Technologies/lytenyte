import { useMemo, type Dispatch, type JSX, type SetStateAction } from "react";
import { useSmartSelect } from "../context.js";
import type { BaseOption } from "../type.js";
import { isSelectableOption } from "./is-selectable-option.js";

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
    onOptionsChange,
    trigger,
    kindAndValue: { value },
    rtl,
    closeKeys,
    openKeys,
  } = useSmartSelect();

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
        if (!open && openKeys.includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(true);
          return;
        }
        if (open && closeKeys.includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(false);
          return;
        }

        if ((e.key === "Enter" || e.key === " ") && open) {
          e.preventDefault();
          e.stopPropagation();

          const active = container?.querySelector('[data-ln-active="true"]') as HTMLElement;
          if (!active) return;

          active.click();

          return;
        }

        if (isMulti && query.length === 0) {
          const key = rtl ? "ArrowRight" : "ArrowLeft";

          if (e.key === "Backspace") {
            const chips = Array.from(
              trigger!.querySelectorAll("[data-ln-smart-select-chip]"),
            ) as HTMLElement[];

            const lastChip = chips.at(-1);
            if (!lastChip) return;

            const id = lastChip.getAttribute("data-ln-smart-select-chip");
            onOptionsChange((value as BaseOption[]).filter((x) => x.id !== id));
            return;
          }

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
          while (current && !isSelectableOption(current)) current = current.previousElementSibling;

          if (!current) {
            current = container.lastElementChild;

            while (current && !isSelectableOption(current)) current = current.previousElementSibling;
          }

          if (current) {
            setActiveId(current.getAttribute("data-ln-smart-option"));
            current.scrollIntoView({ block: "nearest" });
          }
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          e.stopPropagation();

          const active = container.querySelector('[data-ln-active="true"]');
          let current = active?.nextElementSibling;
          while (current && !isSelectableOption(current)) current = current.nextElementSibling;

          if (!current) {
            current = container.firstElementChild;

            while (current && !isSelectableOption(current)) current = current.nextElementSibling;
          }

          if (current) {
            setActiveId(current.getAttribute("data-ln-smart-option"));
            current.scrollIntoView({ block: "nearest" });
          }

          return;
        }
      },
    } satisfies JSX.IntrinsicElements["input"];
  }, [
    closeKeys,
    container,
    isMulti,
    onOpenChange,
    onOptionsChange,
    onQueryChange,
    open,
    openKeys,
    openOnClick,
    preventNextOpen,
    query,
    rtl,
    setActiveChip,
    setActiveId,
    trigger,
    value,
  ]);
}
