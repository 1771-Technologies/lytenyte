import { forwardRef, type JSX } from "react";
import { useGrid } from "../use-grid.js";
import { useSortManagerContext } from "./sort-manager-context.js";
import { sortModelToSortItems } from "./sort-model-to-sort-items.js";
import { clsx } from "@1771technologies/js-utils";

export const SortCancelButton = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
  function SortCancelButton({ className, onClick, children, ...props }, ref) {
    const grid = useGrid();
    const [, setState] = useSortManagerContext();

    return (
      <button
        {...props}
        className={clsx("lng1771-sort-manager__button", className)}
        ref={ref}
        onClick={(ev) => {
          const model = grid.state.sortModel.peek();
          if (model.length) setState(sortModelToSortItems(model, grid));
          else setState([{ sortDirection: "ascending" }]);

          onClick?.(ev);
        }}
      >
        {children ? children : "Cancel"}
      </button>
    );
  },
);
