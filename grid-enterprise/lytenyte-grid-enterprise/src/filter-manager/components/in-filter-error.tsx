import { forwardRef, type JSX, type ReactNode } from "react";
import { useInFilterState } from "./in-filter-root";
import { clsx } from "@1771technologies/js-utils";

export interface InFilterErrorProps {
  children?: (reset: () => void) => ReactNode;
}

export const InFilterError = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & InFilterErrorProps
>(function InFilterError({ children, className, ...props }, ref) {
  const { retry, hasError } = useInFilterState();

  if (!hasError) return null;

  return (
    <div
      {...props}
      className={clsx("lng1771-filter-manager__in-filter-error", className)}
      ref={ref}
    >
      {children?.(retry)}
    </div>
  );
});
