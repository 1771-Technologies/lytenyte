import { getPosition } from "@1771technologies/positioner";
import { useEffect, useState, type CSSProperties, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { useMenuStore } from "./menu-store-content";
import { containsPoint, getClientX, getClientY } from "@1771technologies/js-utils";

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
      className={className}
      style={{ ...style, display: "none", position: "fixed" }}
    >
      {children}
    </div>,
    document.body,
  );
}
