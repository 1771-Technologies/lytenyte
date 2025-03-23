import { forwardRef, type JSX } from "react";
import type { PillManagerPillItem } from "./pill-manager";
import { Pill } from "../pill/pill";

export const PillManagerPill = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { item: PillManagerPillItem }
>(function PillManagerPill({ item, children, ...props }, ref) {
  return (
    <div
      {...props}
      role="button"
      ref={ref}
      data-pill-active={item.active}
      className="lng1771-pill-manager__pill-outer"
      tabIndex={-1}
      onClick={() => {
        item.onToggle();
      }}
    >
      {!children && (
        <Pill kind={item.kind} className="lng1771-pill-manager__pill-inner" interactive>
          <span>{item.label}</span>
          {item.secondaryLabel && (
            <span className="lng1771-pill-manager__pill-inner--secondary-label">
              {item.secondaryLabel}
            </span>
          )}
        </Pill>
      )}
    </div>
  );
});
