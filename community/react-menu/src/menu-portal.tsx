import { getPosition } from "@1771technologies/positioner";
import { useHovered } from "@1771technologies/react-utils";
import { useEffect, useState, type CSSProperties, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { useMenuStore } from "./menu-store-content";

export function MenuPortal({
  target,
  children,
  disabled,
  id,
  className,
  style,
}: PropsWithChildren<{
  target: HTMLDivElement;
  id: string;
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

  const [hovered, props] = useHovered();

  const s = useMenuStore();

  useEffect(() => {
    s.store.expandedIds.set((prev) => {
      const next = new Set(prev);
      if (hovered) next.add(id);
      else next.delete(id);
      return next;
    });
  }, [hovered, id, s]);

  return createPortal(
    <div
      role="menu"
      id={id}
      {...props}
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
