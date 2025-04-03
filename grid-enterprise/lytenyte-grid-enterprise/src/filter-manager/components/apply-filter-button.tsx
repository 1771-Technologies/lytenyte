import { forwardRef, type JSX } from "react";
import { clsx } from "@1771technologies/js-utils";
import { useGrid } from "../../use-grid";
import { flatToCombined } from "../flat-to-combined";
import { useFilterManagerState } from "../filter-state-context";

export const FilterManagerApplyButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"]
>(function FilterManagerApplyButton({ className, onClick, children, ...props }, ref) {
  const { api } = useGrid();
  const { flatFilters, column, isPivot, filters, inFilterValue } = useFilterManagerState();

  return (
    <button
      {...props}
      className={clsx("lng1771-filter-manager__button", className)}
      onClick={(ev) => {
        const combined = flatToCombined<any>(flatFilters);
        const newFilters = { ...filters };

        if (combined) {
          newFilters[column.id] ??= {};
          newFilters[column.id].simple = combined;
        }

        if (inFilterValue) {
          newFilters[column.id] ??= {};
          newFilters[column.id].set = inFilterValue?.size
            ? {
                columnId: column.id,
                kind: "in",
                operator: "notin",
                set: inFilterValue,
              }
            : null;
        }

        if (isPivot) {
          api.columnPivotSetFilterModel(newFilters);
        } else {
          api.getState().filterModel.set(newFilters);
        }

        onClick?.(ev);
      }}
      ref={ref}
    >
      {children ? children : "Apply"}
    </button>
  );
});
