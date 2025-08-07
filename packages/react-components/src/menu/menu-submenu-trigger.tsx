import { useForkRef, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, useRef, type JSX } from "react";
import { useDepth } from "./contexts/context-depth.js";
import { useMenuId } from "./contexts/context-id.js";
import { useSubmenu } from "./contexts/context-submenu.js";
import { useMenuRoot } from "./contexts/context-menu-root.js";
import { getMenuIds } from "./utils/get-menu-ids.js";

export interface MenuSubmenuTriggerProps {
  readonly as?: SlotComponent;
}

export const MenuSubmenuTrigger = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MenuSubmenuTriggerProps
>(function MenuSubMenuTrigger({ as, ...props }, forwarded) {
  const depth = useDepth();
  const { setTrigger } = useSubmenu();

  const submenuId = useMenuId();
  const ctx = useMenuRoot();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const internalProps: JSX.IntrinsicElements["div"] = {
    tabIndex: -1,
    "aria-haspopup": true,
    "aria-expanded": ctx.activeIds.includes(submenuId),
    role: "menuitem",

    onMouseEnter: (ev) => {
      const element = ev.currentTarget;
      element.focus();
      timeoutRef.current = setTimeout(() => {
        const ids = getMenuIds(element);
        ctx.setActiveIds([...ids, submenuId]);
      }, ctx.hoverOpenDelay);
    },

    onMouseLeave: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },

    onKeyDown: (ev) => {
      if (ev.key === "ArrowRight") {
        ev.stopPropagation();
        ev.preventDefault();

        const element = ev.currentTarget;
        const ids = getMenuIds(element);
        ctx.setActiveIds([...ids, submenuId]);

        setTimeout(() => {
          (element.nextElementSibling?.firstElementChild as HTMLElement)?.focus();
        }, 4);
      }
    },
  };

  const ref = useForkRef(setTrigger, forwarded);
  const slot = useSlot({
    props: [
      internalProps,
      props,
      {
        "data-ln-menu-item": true,
        "data-ln-depth": depth,
        "data-ln-menu-subtrigger": true,
        "data-ln-submenu-id": submenuId,
      },
    ],
    slot: as ?? <div />,
    ref,
  });

  return slot;
});
