import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";
import { ArrowDownIcon } from "../icons";

export const ColumnManagerDragBoxExpander = forwardRef<
  HTMLButtonElement,
  Omit<JSX.IntrinsicElements["button"], "children">
>(function ColumnManagerDragBoxExpander({ className, ...props }, ref) {
  return (
    <button
      {...props}
      className={clsx("lng1771-column-manager__drag-box-expander", className)}
      ref={ref}
    >
      <ArrowDownIcon />
    </button>
  );
});
