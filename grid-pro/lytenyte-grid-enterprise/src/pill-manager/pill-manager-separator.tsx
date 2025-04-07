import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";

export const PillManagerSeparator = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function PillManagerSeparator(props, ref) {
    return (
      <div
        {...props}
        className={clsx("lng1771-pill-manager__separator", props.className)}
        ref={ref}
      />
    );
  },
);
