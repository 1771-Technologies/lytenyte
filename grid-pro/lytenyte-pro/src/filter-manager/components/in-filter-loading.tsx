import { forwardRef, type JSX } from "react";
import { useInFilterState } from "./in-filter-root";
import { clsx } from "@1771technologies/js-utils";

export const InFilterLoading = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function InFilterLoading({ children, className, ...props }, ref) {
    const { isLoading } = useInFilterState();

    if (!isLoading) return null;

    return (
      <div
        {...props}
        className={clsx("lng1771-filter-manager__in-filter-loading", className)}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);
