import { forwardRef, useEffect, type JSX } from "react";
import { useSubItemContext } from "./sub-item-context.js";
import {
  dispatchHoverOpen,
  dispatchKeyboardClose,
  dispatchKeyboardOpen,
  getActiveMenuItem,
  getActiveMenuTrigger,
  getDirectChildMenuItems,
  isMenuItem,
  isSubmenuTrigger,
} from "./dom.js";
import { useCombinedRefs } from "../../hooks/use-combined-ref.js";
import { getNearestMatching, isHTMLElement } from "@1771technologies/lytenyte-shared";

function MenuImpl(props: JSX.IntrinsicElements["ul"], ref: JSX.IntrinsicElements["ul"]["ref"]) {
  const sub = useSubItemContext();

  useEffect(() => {
    if (!sub?.submenu) return;

    const c = getDirectChildMenuItems(sub.submenu);

    c.at(0)?.focus();
  }, [sub?.submenu]);

  const combined = useCombinedRefs(ref, sub?.ref);

  return (
    <ul
      {...props}
      onKeyDown={(ev) => {
        props.onKeyDown?.(ev);
        if (ev.isPropagationStopped()) return;

        if (ev.key === "ArrowRight") {
          const activeItem = getActiveMenuItem();
          if (!activeItem || !isSubmenuTrigger(activeItem)) return;
          ev.stopPropagation();
          ev.preventDefault();
          dispatchKeyboardOpen(activeItem);
        } else if (ev.key === "ArrowLeft") {
          const activeItem = getActiveMenuItem();
          if (!activeItem) return;
          const menu = getActiveMenuTrigger();
          if (!menu) return;

          ev.stopPropagation();
          ev.preventDefault();

          dispatchKeyboardClose(menu);

          menu.focus();
        } else if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
          // We need to find the nearest menu item that hsa our focus. There is a possibility that
          // this item won't be present - so if we don't find it, we just return. The user must
          // know what they are doing, so let's not assume.
          const activeItem = getActiveMenuItem();
          if (!activeItem) return;

          ev.stopPropagation();
          ev.preventDefault();

          const menuItems = getDirectChildMenuItems(ev.currentTarget);

          const activeIndex = menuItems.indexOf(activeItem);
          if (ev.key === "ArrowDown") {
            const next = Math.min(activeIndex + 1, menuItems.length - 1);
            menuItems[next].focus();
          } else if (ev.key === "ArrowUp") {
            const next = activeIndex === -1 ? menuItems.length - 1 : Math.max(activeIndex - 1, 0);
            menuItems[next].focus();
          }
        }
      }}
      onMouseMove={(ev) => {
        props.onMouseMove?.(ev);
        if (sub || ev.isPropagationStopped()) return;

        requestAnimationFrame(() => {
          if (!isHTMLElement(ev.target)) return;
          const el = ev.target;

          const menuItem = getNearestMatching(el, isMenuItem);
          if (!menuItem) return;

          const bb = menuItem.getBoundingClientRect();
          if (
            ev.clientX < bb.left ||
            ev.clientX > bb.right ||
            ev.clientY < bb.top ||
            ev.clientY > bb.bottom
          )
            return;

          if (isSubmenuTrigger(menuItem)) dispatchHoverOpen(menuItem);
          menuItem.focus();
        });
      }}
      ref={combined}
      data-ln-menu
      data-ln-submenu={sub ? true : undefined}
      data-transition-state={sub ? sub.transition : undefined}
      style={{
        ...props.style,
        ...(sub ? { position: "absolute" } : {}),
      }}
    />
  );
}

export const Menu = forwardRef(MenuImpl);
