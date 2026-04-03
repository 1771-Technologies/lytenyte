import { useRef, useEffect, type ReactNode } from "react";
import type { CursorCoordinates } from "../types.js";

interface CompletionPopoverProps {
  readonly isOpen: boolean;
  readonly coordinates: CursorCoordinates;
  readonly className?: string;
  readonly children: ReactNode;
}

export function CompletionPopover({ isOpen, coordinates, className, children }: CompletionPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;

    if (isOpen) {
      if (!el.matches(":popover-open")) el.showPopover();
    } else {
      if (el.matches(":popover-open")) el.hidePopover();
    }
  }, [isOpen]);

  return (
    <div
      ref={popoverRef}
      popover="manual"
      className={className}
      style={{
        position: "fixed",
        top: coordinates.top + coordinates.lineHeight,
        left: coordinates.left,
        margin: 0,
        inset: "unset",
        zIndex: 9999,
      }}
    >
      {isOpen ? children : null}
    </div>
  );
}
