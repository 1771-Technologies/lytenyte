import { createContext, forwardRef, useContext, useMemo, type JSX } from "react";
import type { ColumnManagerBoxSource } from "./column-manager-types";
import { useAggregationSource } from "../pill-manager/pill-manager-pills/use-aggregation-source";
import { clsx } from "@1771technologies/js-utils";
import { useMeasuresSource } from "../pill-manager/pill-manager-pills/use-measures-source";
import { useRowGroupsSource } from "../pill-manager/pill-manager-pills/use-row-groups-source";
import { useColumnPivotSource } from "../pill-manager/pill-manager-pills/use-column-pivot-source";
import type { PillManagerPillItem } from "../pill-manager/pill-manager-types";

const context = createContext<{
  pillSource: string;
  dropTags: string[];
  dropData: { target: string; sourceItems: PillManagerPillItem[] };
}>({} as any);

export const ColumnManagerDragBox = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { source: ColumnManagerBoxSource }
>(function ColumnManagerDragBox({ source, className, children, ...props }, ref) {
  const aggs = useAggregationSource(source);
  const measures = useMeasuresSource(source);
  const rowGroups = useRowGroupsSource(source, "vertical");
  const pivots = useColumnPivotSource(source, "vertical");

  const sourceItems = useMemo(() => {
    if (source === "aggregations") return aggs.filter((c) => c.active);
    if (source === "column-pivots") return pivots.filter((c) => c.active);
    if (source === "measures") return measures.filter((c) => c.active);
    if (source === "row-groups") return rowGroups.filter((c) => c.active);

    return [];
  }, [aggs, measures, pivots, rowGroups, source]);

  const dropTags = useMemo(() => {
    if (source === "aggregations") return ["aggregations"];
    if (source === "column-pivots") return ["column-pivot"];
    if (source === "measures") return ["measures"];
    if (source === "row-groups") return ["row-group"];

    return [];
  }, [source]);

  const dropData = useMemo(() => {
    return { target: source, sourceItems };
  }, [source, sourceItems]);

  const value = useMemo(() => {
    return { dropData, dropTags, pillSource: source };
  }, [dropData, dropTags, source]);

  return (
    <context.Provider value={value}>
      <div {...props} className={clsx("lng1771-column-manager__drag-box", className)} ref={ref}>
        {children}
      </div>
    </context.Provider>
  );
});

export const useDragBox = () => useContext(context);
