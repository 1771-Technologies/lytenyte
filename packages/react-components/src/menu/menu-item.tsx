import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useDepth } from "./contexts/context-depth.js";
import { getMenuIds } from "./utils/get-menu-ids.js";
import { useMenuRoot } from "./contexts/context-menu-root.js";

export interface MenuItemProps {
  readonly as?: SlotComponent;
  readonly action?: () => void;
}

export const MenuItem = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & MenuItemProps>(
  function MenuItem({ as, action, ...props }, forwarded) {
    const depth = useDepth();
    const ctx = useMenuRoot();

    const internalProps: JSX.IntrinsicElements["div"] = {
      tabIndex: -1,
      role: "menuitem",

      onClick: () => {
        action?.();
      },
      onKeyDown: (ev) => {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.key !== "Enter") return;
        action?.();
      },

      onMouseEnter: (ev) => {
        const ids = getMenuIds(ev.currentTarget);

        ev.currentTarget.focus();
        ctx.setActiveIds(ids);
      },
    };

    const slot = useSlot({
      props: [internalProps, props, { "data-ln-menu-item": true, "data-ln-depth": depth }],
      slot: as ?? <div />,
      ref: forwarded,
    });

    return slot;
  },
);
