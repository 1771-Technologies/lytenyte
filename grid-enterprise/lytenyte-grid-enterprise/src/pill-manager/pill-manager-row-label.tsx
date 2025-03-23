import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";

export const PillManagerRowLabel = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function PillManagerRowLabel(props, ref) {
    return (
      <div
        {...props}
        className={clsx("lng1771-pill-manager__row-label", props.className)}
        ref={ref}
      />
    );
  },
);
