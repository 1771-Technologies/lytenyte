import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, useId, type JSX } from "react";
import { useMenuRoot } from "./contexts/context-menu-root.js";
import { useDepth } from "./contexts/context-depth.js";
import { upDownMover } from "./utils/up-down-navigator.js";

export interface MenuPanelProps {
  readonly as?: SlotComponent;
}

export const MenuPanel = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & MenuPanelProps>(
  function MenuPanel({ as, ...props }, forwarded) {
    const ctx = useMenuRoot();

    const depth = useDepth();
    const id = useId();

    const internalProps: JSX.IntrinsicElements["div"] = {
      tabIndex: 0,
      role: "menu",

      onKeyDown: upDownMover.handleKeyDown,
      onFocus: (ev) => {
        upDownMover.handleFocus(ev);
        if (ev.currentTarget === ev.target) {
          (ev.currentTarget.firstElementChild as HTMLElement)?.focus();
        }
      },
    };

    const slot = useSlot({
      props: [
        internalProps,
        props,
        {
          "data-ln-menu-panel": true,
          "data-ln-menu-root": true,
          "data-ln-depth": depth,
          "data-ln-menu-id": id,
          "data-ln-is-active-parent": ctx.activeIds.includes(id),
        },
      ],
      ref: forwarded,
      slot: as ?? <div />,
    });

    return slot;
  },
);
