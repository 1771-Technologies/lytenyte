import { getNearestMatching, getTabbables } from "@1771technologies/lytenyte-shared";
import type { KeyboardEvent } from "react";

export function handleVerticalNavigation(ev: KeyboardEvent<HTMLElement>) {
  const nearestMenu = getNearestMatching(
    ev.currentTarget,
    (el) => el.getAttribute("data-ln-menu") === "true",
  );
  if (!nearestMenu) return;

  const tabbables = getTabbables(nearestMenu)
    .filter((x) => {
      const nearest = getNearestMatching(x, (el) => el.getAttribute("data-ln-menu") === "true");
      return nearest === nearestMenu;
    })
    .filter((x) => x.getAttribute("data-ln-menu-item") === "true");

  const activeItem = getNearestMatching(
    ev.currentTarget,
    (el) => el.getAttribute("data-ln-menu-item") === "true",
  );

  const index = tabbables.indexOf(activeItem!);
  if (index === -1) return;

  if (ev.key === "ArrowDown") {
    ev.stopPropagation();
    ev.preventDefault();
    const next = tabbables[index + 1];
    next?.focus();
  } else if (ev.key === "ArrowUp") {
    ev.stopPropagation();
    ev.preventDefault();
    const prev = tabbables[index - 1];
    prev?.focus();
  }
}
