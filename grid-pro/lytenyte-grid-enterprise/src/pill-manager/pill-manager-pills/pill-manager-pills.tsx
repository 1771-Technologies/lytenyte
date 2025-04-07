import { forwardRef, useMemo, type JSX } from "react";
import { clsx } from "@1771technologies/js-utils";
import { useAggregationSource } from "./use-aggregation-source";
import { useMeasuresSource } from "./use-measures-source";
import { useColumnSource } from "./use-column-source";
import { useRowGroupsSource } from "./use-row-groups-source";
import { useColumnPivotSource } from "./use-column-pivot-source";
import {
  useDrag,
  useDragStore,
  useDroppable,
  useEdgeScroll,
} from "@1771technologies/lytenyte-grid-community/internal";
import { useCombinedRefs } from "@1771technologies/react-utils";
import type { DragTag, PillProps } from "../pill-manager-types";
import { usePillRow } from "../pill-manager-row";

export const PillManagerPills = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & PillProps
>(function PillManagerRow({ children, ...props }, ref) {
  const { pillSource } = usePillRow();

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
    if (pillSource === "columns") return ["columns"];
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

  const store = useDragStore();
  const isActive = useDrag(store, (s) => !!s.active);

  const re = useEdgeScroll({ isActive: isActive, direction: "horizontal" });

  const allRefs = useCombinedRefs(re, combined);

  return (
    <div
      {...props}
      className={clsx("lng1771-pill-manager__pills", props.className)}
      data-is-drop-target={isTarget}
      ref={allRefs}
      data-pill-source={pillSource}
      data-drop-visible={canDrop && sourceItems.filter((c) => c.active).length === 0}
      tabIndex={-1}
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
