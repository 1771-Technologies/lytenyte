import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";

export const ColumnManagerDragBoxControls = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"]
>(function ColumnManagerDragBoxControls({ className, children, ...props }, ref) {
  return (
    <div
      {...props}
      className={clsx("lng1771-column-manager__drag-box-controls", className)}
      ref={ref}
    >
      {children}
    </div>
  );
});
