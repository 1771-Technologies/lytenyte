import { getPosition } from "@1771technologies/positioner";
import { useEffect, useState, type CSSProperties, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

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

  return createPortal(
    <div
      role="menu"
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
