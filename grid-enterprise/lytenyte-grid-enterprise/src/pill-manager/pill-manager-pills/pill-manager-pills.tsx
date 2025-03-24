import { forwardRef, useMemo, type JSX } from "react";
import { clsx } from "@1771technologies/js-utils";
import { useAggregationSource } from "./use-aggregation-source";
import { useMeasuresSource } from "./use-measures-source";
import { useColumnSource } from "./use-column-source";
import { useRowGroupsSource } from "./use-row-groups-source";
import { useColumnPivotSource } from "./use-column-pivot-source";
import { useDroppable } from "@1771technologies/lytenyte-grid-community/internal";
import { useCombinedRefs } from "@1771technologies/react-utils";
import type { DragTag, PillsProps } from "../pill-manager-types";

export const PillManagerPills = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & PillsProps
>(function PillManagerRow({ pillSource, children, ...props }, ref) {
  const aggs = useAggregationSource(pillSource);
  const measures = useMeasuresSource(pillSource);
  const columns = useColumnSource(pillSource);
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
    if (pillSource === "columns") return []; // Nothing can be dropped on the column pills
    if (pillSource === "aggregations") return ["aggregations"];
    if (pillSource === "column-pivots") return ["column-pivot"];
    if (pillSource === "measures") return ["measures"];
    if (pillSource === "row-groups") return ["row-group"];

    return [];
  }, [pillSource]);

  const dropData = useMemo(() => {
    return { target: pillSource, sourceItems };
  }, [pillSource, sourceItems]);

  const {
    canDrop,
    isTarget,
    isNearestOver,
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
      data-drop-visible={canDrop && sourceItems.filter((c) => c.active).length === 0}
    >
      <div className="lng1771-pill-manager__pills-inner">
        {children({ pills: sourceItems })}
        {canDrop && isNearestOver && sourceItems.filter((c) => c.active).length > 0 && (
          <div className="lng1771-pill-manager__drop-indicator-end" />
        )}
      </div>
    </div>
  );
});
