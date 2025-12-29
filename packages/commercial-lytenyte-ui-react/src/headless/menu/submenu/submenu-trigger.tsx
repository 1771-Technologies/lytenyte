import { forwardRef, useEffect, useRef, useState, type JSX } from "react";
import { useSubmenuContext } from "./submenu-context.js";
import { useCombinedRefs } from "../../../hooks/use-combined-ref.js";
import { getNearestMatching, getTabbables } from "@1771technologies/lytenyte-shared";
import { handleVerticalNavigation } from "../item/handle-vertical-navigation.js";

function SubmenuTriggerImpl({ disabled, ...props }: SubmenuTrigger.Props, ref: SubmenuTrigger.Props["ref"]) {
  const [active, setActive] = useState(false);
  const sub = useSubmenuContext();
  const [triggerEl, setTriggerEl] = useState<HTMLDivElement | null>(null);

  const combined = useCombinedRefs(setTriggerEl, ref);

  const blurRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!triggerEl || !sub) return;

    const controller = new AbortController();
    const signal = controller.signal;
    triggerEl.addEventListener(
      "ln-activate-mouse",
      () => {
        triggerEl.focus();
        sub.onOpenChange(true);
        if (blurRef.current) clearTimeout(blurRef.current);
      },
      { signal },
    );
    triggerEl.addEventListener(
      "ln-deactivate-mouse",
      () => {
        blurRef.current = setTimeout(() => {
          triggerEl.blur();
        }, 100);
      },
      { signal },
    );

    return () => controller.abort();
  }, [sub, triggerEl]);

  if (!sub) return null;

  return (
    <div
      {...props}
      tabIndex={0}
      data-ln-open={sub.open}
      data-ln-menu-item
      data-ln-subtrigger
      data-ln-active={active}
      data-ln-disabled={disabled ? true : undefined}
      inert={disabled ? true : undefined}
      ref={combined}
      onFocus={(ev) => {
        props.onFocus?.(ev);
        if (ev.isPropagationStopped()) return;

        setActive(true);
      }}
      onBlur={(ev) => {
        props.onBlur?.(ev);
        if (ev.isPropagationStopped()) return;
        setActive(false);

        const triggerRoot = getNearestMatching(
          triggerEl!,
          (el) => el.getAttribute("data-ln-submenu-root") === "true",
        );
        if (!triggerRoot || triggerRoot.contains(ev.relatedTarget)) return;

        sub.onOpenChange(false);
      }}
      onKeyDown={(ev) => {
        if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
          handleVerticalNavigation(ev);
          return;
        }

        if (ev.key === "ArrowRight") {
          ev.stopPropagation();
          ev.preventDefault();
          sub.onOpenChange(true);
          const el = ev.currentTarget;
          setTimeout(() => {
            const submenu = getNearestMatching(el, (el) => {
              return el.getAttribute("data-ln-submenu-root") === "true";
            });
            const menu = submenu?.querySelector(
              '[data-ln-menu="true"][data-ln-submenu="true"]',
            ) as HTMLElement;
            if (!menu) return;

            const first = getTabbables(menu).filter((x) => x.getAttribute("data-ln-menu-item") === "true")[0];
            first?.focus();
          }, 20);
        }
      }}
    />
  );
}

export const SubmenuTrigger = forwardRef(SubmenuTriggerImpl);

export namespace SubmenuTrigger {
  export type Props = JSX.IntrinsicElements["div"] & { disabled?: boolean };
}
