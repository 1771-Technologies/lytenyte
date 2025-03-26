import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";

export const ColumnManagerDragBoxLabel = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function ColumnManagerDragBoxLabel({ className, children, ...props }, ref) {
    return (
      <div
        {...props}
        className={clsx("lng1771-column-manager__drag-box-label", className)}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);
