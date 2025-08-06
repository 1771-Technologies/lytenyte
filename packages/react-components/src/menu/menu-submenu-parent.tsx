import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { DepthProvider, useDepth } from "./contexts/context-depth.js";
import { useMenuId } from "./contexts/context-id.js";
import { upDownMover } from "./utils/up-down-navigator.js";
import { getMenuId } from "./utils/get-menu-id.js";
import { getNearestMenuRoot } from "./utils/get-nearest-menu-root.js";
import { getMenuIds } from "./utils/get-menu-ids.js";
import { useMenuRoot } from "./contexts/context-menu-root.js";

export interface MenuSubmenuParentProps {
  readonly as?: SlotComponent;
}

export const MenuSubmenuParent = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MenuSubmenuParentProps
>(function MenuSubMenu({ as, ...props }, forwarded) {
  const depth = useDepth() + 1;
  const id = useMenuId();
  const ctx = useMenuRoot();

  const internalProps: JSX.IntrinsicElements["div"] = {
    role: "menu",
    onKeyDown: (ev) => {
      if (ev.ctrlKey || ev.metaKey || ev.shiftKey) return;

      if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
        upDownMover.handleKeyDown(ev);
        return;
      }

      if (ev.key === "ArrowLeft") {
        ev.stopPropagation();
        ev.preventDefault();

        const menuRoot = getNearestMenuRoot(ev.currentTarget);
        const id = getMenuId(menuRoot!);

        const trigger = ev.currentTarget.parentElement?.querySelector(
          `[data-ln-submenu-id="${id}"]`,
        ) as HTMLElement;
        trigger.focus();

        const nextIds = getMenuIds(trigger);
        ctx.setActiveIds(nextIds);
      }
    },
    onFocus: upDownMover.handleFocus,
  };

  const slot = useSlot({
    props: [
      internalProps,
      props,
      { "data-ln-menu-root": true, "data-ln-depth": depth, "data-ln-menu-id": id },
    ],
    ref: forwarded,
    slot: as ?? <div />,
  });

  return <DepthProvider value={depth}>{slot}</DepthProvider>;
});
