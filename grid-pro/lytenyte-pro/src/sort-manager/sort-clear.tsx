import { forwardRef, type JSX } from "react";
import { useGrid } from "../use-grid.js";
import { useSortManagerContext } from "./sort-manager-context.js";
import { clsx } from "@1771technologies/js-utils";

export const SortClearButton = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
  function SortClearButton({ className, onClick, children, ...props }, ref) {
    const grid = useGrid();
    const [, setState] = useSortManagerContext();

    return (
      <button
        {...props}
        className={clsx("lng1771-sort-manager__button", className)}
        ref={ref}
        onClick={(ev) => {
          setState([]);
          grid.state.sortModel.set([]);

          onClick?.(ev);
        }}
      >
        {children ? children : "Clear"}
      </button>
    );
  },
);
