import { forwardRef, type JSX } from "react";
import { useListboxContext } from "./context";
import { getTabbables } from "@1771technologies/lytenyte-dom-utils";

export const Item = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function Item(props, forwarded) {
    const ctx = useListboxContext();

    return (
      <div
        {...props}
        role="option"
        onKeyDownCapture={(ev) => {
          const next = ctx.rtl ? "ArrowLeft" : "ArrowRight";
          const prev = ctx.rtl ? "ArrowRight" : "ArrowLeft";

          if (ev.key !== next && ev.key !== prev) return;

          ev.preventDefault();
          const items = getTabbables(ev.currentTarget);
          if (!items.length) return;

          items.unshift(ev.currentTarget);

          const index = items.findIndex((c) => document.activeElement === c);

          const nextIndex = ev.key === next ? index + 1 : index - 1;
          const itemToFocus = items[nextIndex];

          if (!itemToFocus) return;

          ev.stopPropagation();
          itemToFocus.focus();
        }}
        ref={forwarded}
        tabIndex={0}
        data-ln-listbox-item
      />
    );
  },
);
