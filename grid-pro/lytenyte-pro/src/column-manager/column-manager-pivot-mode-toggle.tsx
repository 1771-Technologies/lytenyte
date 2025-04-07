import { forwardRef, useId, type JSX } from "react";
import { Toggle } from "../components-internal/toggle/toggle";
import { useGrid } from "../use-grid";
import { clsx } from "@1771technologies/js-utils";

export const PivotModeToggle = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function PivotModeToggle({ children, className, ...props }, ref) {
    const grid = useGrid();
    const state = grid.state;
    const id = useId();

    const pivotMode = state.columnPivotModeIsOn.use();

    return (
      <div {...props} className={clsx("lng1771-column-manager__pivot-toggle", className)} ref={ref}>
        <Toggle id={id} on={pivotMode} onChange={(b) => state.columnPivotModeIsOn.set(b)} />
        <label htmlFor={id} className="lng1771-column-manager__pivot-toggle-label">
          {children ?? "Pivot Mode"}
        </label>
      </div>
    );
  },
);
