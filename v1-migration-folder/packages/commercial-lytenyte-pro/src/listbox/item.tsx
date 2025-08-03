import { forwardRef, type JSX } from "react";
import { useListboxContext } from "./context";
import { tabbable } from "tabbable";

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

          const items = tabbable(ev.currentTarget);
          if (!items.length) return;

          items.unshift(ev.currentTarget);

          const index = items.findIndex((c) => document.activeElement === c);

          const nextIndex = ev.key === next ? index + 1 : index - 1;
          const itemToFocus = items[nextIndex];

          if (!itemToFocus) return;

          ev.preventDefault();
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
