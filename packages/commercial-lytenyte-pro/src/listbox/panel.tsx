import { forwardRef, useEffect, useState, type JSX } from "react";
import { useListboxContext } from "./context";
import { useCombinedRefs } from "@1771technologies/lytenyte-react-hooks";
import { getTabbables } from "@1771technologies/lytenyte-dom-utils";

export const Panel = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function Panel(props, forwarded) {
    const [ref, setRef] = useState<HTMLDivElement | null>();

    const combinedRef = useCombinedRefs(setRef, forwarded);

    const ctx = useListboxContext();

    useEffect(() => {
      if (!ref) return;

      const controller = new AbortController();

      const isVert = ctx.orientation === "vertical";
      const nextKey = isVert ? "ArrowDown" : ctx.rtl ? "ArrowLeft" : "ArrowRight";
      const prevKey = isVert ? "ArrowUp" : ctx.rtl ? "ArrowRight" : "ArrowLeft";

      ref.addEventListener(
        "keydown",
        (ev) => {
          if (ev.key === "Tab") {
            if (ref.contains(document.activeElement) || document.activeElement === ref) {
              ref.inert = true;
              setTimeout(() => {
                ref.inert = false;
              }, 10);
            }
          }

          if (ev.key === nextKey) {
            const items = getTabbables(ref).filter(
              (c) => c.getAttribute("data-ln-listbox-item") === "true",
            );
            const currentIndex = items.findIndex(
              (c) => c.contains(document.activeElement) || c === document.activeElement,
            );
            const focusItem =
              currentIndex === -1 ? items[0] : (items[currentIndex + 1] ?? items[0]);
            if (!focusItem) return;

            focusItem.focus();
            ev.preventDefault();
            ev.stopPropagation();
          }
          if (ev.key === prevKey) {
            const items = getTabbables(ref).filter(
              (c) => c.getAttribute("data-ln-listbox-item") === "true",
            );
            const currentIndex = items.findIndex(
              (c) => c.contains(document.activeElement) || c === document.activeElement,
            );
            const focusItem =
              currentIndex === -1 ? items.at(-1) : (items[currentIndex - 1] ?? items.at(-1));
            if (!focusItem) return;

            focusItem.focus();
            ev.preventDefault();
            ev.stopPropagation();
          }
        },
        { signal: controller.signal },
      );

      return () => controller.abort();
    }, [ctx.orientation, ctx.rtl, ref]);

    return (
      <div
        aria-label="Generic listbox with keyboard navigable items"
        {...props}
        ref={combinedRef}
        data-ln-listbox-panel
        role="listbox"
        tabIndex={0}
      >
        {props.children}
        <div
          aria-label="a presentational item that can be ignored"
          tabIndex={0}
          onFocus={() => ref?.focus()}
          role="option"
        />
      </div>
    );
  },
);
