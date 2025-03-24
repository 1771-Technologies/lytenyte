import { forwardRef, useMemo, type JSX, type ReactNode } from "react";
import type { DragTag } from "../pill-manager";
import { type PillManagerPillItem } from "../pill-manager";
import { clsx } from "@1771technologies/js-utils";
import { useAggregationSource } from "./use-aggregation-source";
import { useMeasuresSource } from "./use-measures-source";
import { useColumnSoruce } from "./use-column-source";
import { useRowGroupsSource } from "./use-row-groups-source";
import { useColumnPivotSource } from "./use-column-pivot-source";
import { useDroppable } from "@1771technologies/lytenyte-grid-community/internal";
import { useCombinedRefs } from "@1771technologies/react-utils";

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

  const dropTags = useMemo<DragTag[]>(() => {
    if (pillSource === "columns") return ["columns"];
    if (pillSource === "aggregations") return ["aggregations"];
    if (pillSource === "column-pivots") return ["column-pivot"];
    if (pillSource === "measures") return ["measures"];
    if (pillSource === "row-groups") return ["row-group"];

    return [];
  }, [pillSource]);

  const dropData = useMemo(() => {
    return { target: pillSource };
  }, [pillSource]);

  const {
    canDrop,
    isTarget,
    ref: dropRef,
  } = useDroppable({
    id: `${pillSource}-pills`,
    accepted: dropTags,
    data: dropData,
  });

  const combined = useCombinedRefs(dropRef, ref);

  return (
    <div
      {...props}
      className={clsx("lng1771-pill-manager__pills", props.className)}
      data-is-drop-target={isTarget}
      ref={combined}
      data-pill-source={pillSource}
    >
      {children({ pills: sourceItems })}

      {canDrop && sourceItems.filter((c) => c.active).length === 0 && (
        <div className="lng1771-pill-manager__drop-indicator-start" />
      )}
    </div>
  );
});
