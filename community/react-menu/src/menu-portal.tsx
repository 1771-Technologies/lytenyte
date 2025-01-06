import { getPosition } from "@1771technologies/positioner";
import { useEffect, useState, type CSSProperties, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { useIdStack } from "./menu-id-stack";
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

  const ids = useIdStack();
  const s = useMenuStore();

  return createPortal(
    <div
      role="menu"
      onMouseEnter={() => {
        ids.forEach((id) => s.store.updateExpansion.peek()(id, true));
      }}
      onMouseLeave={() => {
        ids.forEach((id) => s.store.updateExpansion.peek()(id, false));
      }}
      id={id}
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
