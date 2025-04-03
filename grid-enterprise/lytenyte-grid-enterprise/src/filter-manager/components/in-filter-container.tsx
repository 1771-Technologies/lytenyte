import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";

export const InFilterContainer = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function InFilterContainer(props, ref) {
    return (
      <div
        {...props}
        className={clsx("lng1771-filter-manager__in-filter-container", props.className)}
        ref={ref}
      />
    );
  },
);
