import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";
import { ArrowDownIcon, ArrowRightIcon } from "../icons";
import { useDragBox } from "./column-manager-drag-box";
import { useGrid } from "../use-grid";

export const ColumnManagerDragBoxExpander = forwardRef<
  HTMLButtonElement,
  Omit<JSX.IntrinsicElements["button"], "children">
>(function ColumnManagerDragBoxExpander({ className, ...props }, ref) {
  const { pillSource } = useDragBox();
  const { state: sx } = useGrid();

  const key =
    pillSource === "row-groups"
      ? "rowGroups"
      : pillSource === "aggregations"
        ? "values"
        : pillSource === "column-pivots"
          ? "columnPivots"
          : "measures";
  const expansions = sx.internal.columnManagerBoxExpansions.use();
  const expanded = expansions[key];

  return (
    <button
      {...props}
      className={clsx("lng1771-column-manager__drag-box-expander", className)}
      onClick={() => {
        const current = sx.internal.columnManagerBoxExpansions.peek();
        const next = current[key] == null ? false : !current[key];

        sx.internal.columnManagerBoxExpansions.set({
          ...current,
          [key]: next,
        });
      }}
      ref={ref}
    >
      {expanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
    </button>
  );
});
