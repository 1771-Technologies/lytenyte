import { forwardRef, useMemo, type JSX, type ReactNode } from "react";
import type { PillManagerPillItem } from "../pill-manager";
import { clsx } from "@1771technologies/js-utils";
import { useAggregationSource } from "./use-aggregation-source";
import { useMeasuresSource } from "./use-measures-source";
import { useColumnSoruce } from "./use-column-source";
import { useRowGroupsSource } from "./use-row-groups-source";
import { useColumnPivotSource } from "./use-column-pivot-source";

export interface PillsProps {
  readonly pillSource: "columns" | "column-pivots" | "row-groups" | "measures" | "aggregations";
  readonly children: (p: { pills: PillManagerPillItem[] }) => ReactNode;
}

export const PillManagerPills = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & PillsProps
>(function PillManagerRow({ pillSource, children, ...props }, ref) {
  const aggs = useAggregationSource(pillSource);
  const measures = useMeasuresSource(pillSource);
  const columns = useColumnSoruce(pillSource);
  const rowGroups = useRowGroupsSource(pillSource);
  const pivots = useColumnPivotSource(pillSource);

  const sourceItems = useMemo(() => {
    if (pillSource === "columns") return columns;
    if (pillSource === "column-pivots") return pivots;
    if (pillSource === "row-groups") return rowGroups;
    if (pillSource === "aggregations") return aggs;
    if (pillSource === "measures") return measures;

    return [];
  }, [aggs, columns, measures, pillSource, pivots, rowGroups]);

  return (
    <div
      {...props}
      className={clsx("lng1771-pill-manager__pills", props.className)}
      ref={ref}
      data-pill-source={pillSource}
    >
      {children({ pills: sourceItems })}
    </div>
  );
});
