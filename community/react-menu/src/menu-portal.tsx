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
  parentId,
  className,
  style,
}: PropsWithChildren<{
  target: HTMLDivElement;
  id: string;
  parentId: string;
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

  return createPortal(
    <div
      role="menu"
      id={id}
      onMouseEnter={() => s.store.setActiveId.peek()(parentId)}
      onMouseLeave={(e) => {
        const parent = (e.target as HTMLElement).parentElement as HTMLElement;
        if (containsPoint(parent, getClientX(e.nativeEvent), getClientY(e.nativeEvent))) {
          s.store.setActiveId.peek()(parentId);
        } else {
          s.store.setActiveId.peek()(null);
        }
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
