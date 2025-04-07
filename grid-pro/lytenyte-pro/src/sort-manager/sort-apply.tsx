import { forwardRef, type JSX } from "react";
import { useGrid } from "../use-grid.js";
import { sortItemsToSortModel } from "./sort-items-to-sort-model.js";
import { useSortManagerContext } from "./sort-manager-context.js";
import { clsx } from "@1771technologies/js-utils";

export const SortApplyButton = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
  function SortApplyButton({ className, onClick, children, ...props }, ref) {
    const grid = useGrid();
    const [state] = useSortManagerContext();

    return (
      <button
        {...props}
        className={clsx("lng1771-sort-manager__button", className)}
        onClick={(ev) => {
          grid.state.sortModel.set(sortItemsToSortModel(state));
          onClick?.(ev);
        }}
        ref={ref}
      >
        {children ? children : "Apply"}
      </button>
    );
  },
);
