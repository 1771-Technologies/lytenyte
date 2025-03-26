import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";

export const ColumnManagerDropZone = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function ColumnManagerDropZone({ className, children, ...props }, ref) {
    return (
      <div {...props} className={clsx("lng1771-column-manager__drop-zone", className)} ref={ref}>
        {children}
      </div>
    );
  },
);
