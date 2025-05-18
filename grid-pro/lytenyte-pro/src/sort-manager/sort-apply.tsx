import { forwardRef, type JSX } from "react";
import { useGrid } from "../use-grid.js";
import { sortItemsToSortModel } from "./sort-items-to-sort-model.js";
import { useSortManagerContext } from "./sort-manager-context.js";
import { clsx } from "@1771technologies/js-utils";
import { sortModelToSortItems } from "./sort-model-to-sort-items.js";

export const SortApplyButton = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
  function SortApplyButton({ className, onClick, children, ...props }, ref) {
    const grid = useGrid();
    const [state, setState] = useSortManagerContext();

    return (
      <button
        {...props}
        className={clsx("lng1771-sort-manager__button", className)}
        onClick={(ev) => {
          const model = sortItemsToSortModel(state);
          grid.state.sortModel.set(model);

          setState(sortModelToSortItems(model, grid));

          onClick?.(ev);
        }}
        ref={ref}
      >
        {children ? children : "Apply"}
      </button>
    );
  },
);
