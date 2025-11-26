import { useEffect, useRef } from "react";
import { useSubmenuContext } from "./submenu/submenu-context.js";
import { getNearestMatching } from "@1771technologies/lytenyte-shared";
import { dispatchActivate, dispatchClose, dispatchDeactivate, getSubmenuRoots } from "./dom.js";

export function useMenu(el: HTMLElement | null) {
  const sub = useSubmenuContext();

  const mouseOutTime = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!el || sub) return;

    const controller = new AbortController();

    document.addEventListener(
      "keydown",
      (ev) => {
        if (el.contains(document.activeElement)) return;

        if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;

        const menu = Array.from(document.querySelectorAll("[data-ln-menu]")).at(-1) as HTMLElement;
        if (!menu) return;

        const firstItem = menu.querySelector("[data-ln-menu-item") as HTMLElement;
        firstItem.focus?.();
      },
      { signal: controller.signal },
    );

    el.addEventListener(
      "mouseover",
      (ev) => {
        const target = ev.target as HTMLElement;
        const item = getNearestMatching(
          target,
          (el) => el.getAttribute("data-ln-menu-item") === "true",
        );
        if (!item) return;

        if (item) {
          const itemRoots = getSubmenuRoots(item);

          const menus = el.querySelectorAll(
            '[data-ln-submenu-root="true"]',
          ) as unknown as HTMLElement[];

          menus.forEach((m) => {
            if (!itemRoots.includes(m)) dispatchClose(m);
          });
        }

        if (mouseOutTime.current) clearTimeout(mouseOutTime.current);
        dispatchActivate(item);
      },
      { signal: controller.signal },
    );

    el.addEventListener(
      "mouseout",
      (ev) => {
        const target = ev.target as HTMLElement;
        const item = getNearestMatching(
          target,
          (el) => el.getAttribute("data-ln-menu-item") === "true",
        );
        if (!item) return;

        mouseOutTime.current = setTimeout(() => {
          dispatchDeactivate(item);
          mouseOutTime.current = null;
        });
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [el, sub]);
}
