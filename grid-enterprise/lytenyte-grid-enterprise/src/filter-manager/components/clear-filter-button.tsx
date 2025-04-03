import { forwardRef, type JSX } from "react";
import { clsx } from "@1771technologies/js-utils";
import { useGrid } from "../../use-grid";
import { useFilterManagerState } from "../filter-state-context";

export const FilterManagerClearButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"]
>(function FilterManagerClearButton({ className, onClick, children, ...props }, ref) {
  const { api } = useGrid();
  const { filters, column, isPivot } = useFilterManagerState();
  return (
    <button
      {...props}
      className={clsx("lng1771-filter-manager__button", className)}
      onClick={(ev) => {
        const newFilters = { ...filters };
        delete newFilters[column.id];

        if (isPivot) {
          api.columnPivotSetFilterModel(newFilters);
        } else {
          api.getState().filterModel.set(newFilters);
        }

        onClick?.(ev);
      }}
      ref={ref}
    >
      {children ? children : "Clear"}
    </button>
  );
});
