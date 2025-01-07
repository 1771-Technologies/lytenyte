import { getPosition } from "@1771technologies/positioner";
import { useEffect, useState, type CSSProperties, type PropsWithChildren } from "react";
import { useMenuStore } from "./menu-store-context";
import {
  containsPoint,
  getClientX,
  getClientY,
  getFocusableElements,
} from "@1771technologies/js-utils";
import { useIsRtl } from "@1771technologies/react-utils";
import type { MenuParent } from "./menu-root";

export function MenuPortal({
  target,
  children,
  disabled,
  id,
  className,
  hasParent,
  item,
  style,
}: PropsWithChildren<{
  target: HTMLDivElement;
  id: string;
  item: MenuParent;
  hasParent: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}>) {
  const itemId = item.id;
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const display = style?.display ?? "block";
  const rtl = useIsRtl();

  useEffect(() => {
    if (!menu) return;

    menu.style.display = display;
    const reference = target.getBoundingClientRect();
    const floating = menu.getBoundingClientRect();

    const placement = rtl ? "left-start" : "right-start";
    const pos = getPosition({ reference, floating, placement });

    menu.style.top = `${pos.y}px`;
    menu.style.left = `${pos.x}px`;
  }, [display, menu, rtl, target]);

  const s = useMenuStore();
  const setActive = s.store.setActiveId.peek();

  return (
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
          ev.stopPropagation();
          return;
        }

        const startDir = rtl ? "ArrowRight" : "ArrowLeft";
        const endDir = rtl ? "ArrowLeft" : "ArrowRight";

        if (ev.key === startDir && document.activeElement === menu) {
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

        if (ev.key === endDir) {
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
        if (ev.key === startDir) {
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
          setActive(itemId ?? null, 200);
          return;
        }
        setActive(null, 200);
      }}
      ref={setMenu}
      aria-disabled={disabled}
      aria-label={item.axe?.axeLabel}
      aria-description={item.axe?.axeDescription}
      data-disabled={disabled}
      data-itemid={itemId}
      className={className}
      style={{ ...style, display: "none", position: "fixed" }}
    >
      {children}
    </div>
  );
}
