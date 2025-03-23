import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";

export const PillManagerRows = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function PillManagerRows(props, ref) {
    return (
      <div {...props} className={clsx("lng1771-pill-manager__rows", props.className)} ref={ref} />
    );
  },
);
