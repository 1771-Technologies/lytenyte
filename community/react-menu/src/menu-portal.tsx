import { getPosition } from "@1771technologies/positioner";
import { useEffect, useState, type CSSProperties, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { useMenuStore } from "./menu-store-content";
import {
  containsPoint,
  getClientX,
  getClientY,
  getFocusableElements,
} from "@1771technologies/js-utils";

export function MenuPortal({
  target,
  children,
  disabled,
  id,
  className,
  hasParent,
  itemId,
  style,
}: PropsWithChildren<{
  target: HTMLDivElement;
  id: string;
  itemId: string;
  hasParent: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}>) {
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const display = style?.display ?? "block";

  useEffect(() => {
    if (!menu) return;

    menu.style.display = display;
    const reference = target.getBoundingClientRect();
    const floating = menu.getBoundingClientRect();

    const pos = getPosition({ reference, floating, placement: "right-start" });

    menu.style.top = `${pos.y}px`;
    menu.style.left = `${pos.x}px`;
  }, [display, menu, target]);

  const s = useMenuStore();
  const setActive = s.store.setActiveId.peek();

  return createPortal(
    <div
      role="menu"
      id={id}
      tabIndex={-1}
      onKeyDown={(ev) => {
        const unfilteredItems = getFocusableElements(menu!, true);
        const items = unfilteredItems.filter((c) => c.getAttribute("role")?.includes("menu"));

        if (!items.length || !document.activeElement) return;

        if (ev.key === "ArrowDown" && document.activeElement === menu) {
          items[0].focus();
          ev.preventDefault();
          return;
        }

        if (ev.key === "ArrowLeft" && document.activeElement === menu) {
          const parent = document.getElementById(itemId);
          ev.preventDefault();
          ev.stopPropagation();

          parent?.focus();
          s.store.activeId.set(itemId);

          return;
        }

        const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];

        if (!keys.includes(ev.key)) return;

        let activeMenuItem = document.activeElement as HTMLElement;
        while (activeMenuItem && !activeMenuItem.role?.includes("menu"))
          activeMenuItem = activeMenuItem.parentElement as HTMLElement;

        const active = items.indexOf(document.activeElement as HTMLElement);
        if (active === -1) return;

        if (ev.key === "ArrowDown") {
          const next = active + 1;
          if (next >= items.length) return;

          items[next].focus();

          ev.preventDefault();
          ev.stopPropagation();
        }

        if (ev.key === "ArrowUp") {
          const next = active - 1;
          if (next < 0) return;
          items[next].focus();

          ev.preventDefault();
          ev.stopPropagation();
        }

        if (ev.key === "ArrowRight") {
          const current = items[active];

          if (current.dataset.haspopover) {
            s.store.activeId.set(current.id);

            setTimeout(() => {
              const el = document.querySelector(`[data-itemid="${current.id}"]`) as HTMLElement;
              el?.focus();
            }, 20);
          }

          ev.preventDefault();
          ev.stopPropagation();
        }
        if (ev.key === "ArrowLeft") {
          const parent = document.getElementById(itemId);
          if (parent) {
            parent.focus();
            s.store.activeId.set(itemId);
          }
          ev.preventDefault();
          ev.stopPropagation();
        }
      }}
      onPointerEnter={() => {
        setActive(itemId);
      }}
      onPointerLeave={(e) => {
        const parent = (e.target as HTMLElement).parentElement!;
        if (
          hasParent &&
          containsPoint(parent, getClientX(e.nativeEvent), getClientY(e.nativeEvent))
        ) {
          setActive(itemId ?? null, 20);
          return;
        }
        setActive(null, 20);
      }}
      ref={setMenu}
      aria-disabled={disabled}
      data-disabled={disabled}
      data-itemid={itemId}
      className={className}
      style={{ ...style, display: "none", position: "fixed" }}
    >
      {children}
    </div>,
    document.body,
  );
}
