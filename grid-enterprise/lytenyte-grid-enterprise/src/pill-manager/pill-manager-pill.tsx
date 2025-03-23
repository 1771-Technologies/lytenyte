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
      ref={ref}
      data-pill-active={item.active}
      className="lng1771-pill-manager__pill-outer"
    >
      {!children && (
        <Pill kind={item.kind} className="lng1771-pill-manager__pill-inner" interactive>
          <span>{item.label}</span>
          {item.secondaryLabel && <span>{item.secondaryLabel}</span>}
        </Pill>
      )}
    </div>
  );
});
