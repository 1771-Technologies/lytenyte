import { forwardRef, useMemo, type JSX } from "react";
import { clsx } from "@1771technologies/js-utils";
import { useDroppable as useNativeDrop } from "@1771technologies/react-dragon";
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
} from "@1771technologies/lytenyte-core/internal";
import { useCombinedRefs } from "@1771technologies/react-utils";
import type { DragTag, PillProps } from "../pill-manager-types";
import { usePillRow } from "../pill-manager-row";
import { useGrid } from "../../use-grid";
import type { ColumnProReact } from "@1771technologies/grid-types/pro-react";

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

  const grid = useGrid();
  const gridId = grid.state.gridId.use();

  const {
    canDrop: canDropNative,
    onDragOver,
    onDrop,
  } = useNativeDrop({
    tags: pillSource === "row-groups" ? [`${gridId}:grid:groupable`] : [],
    onDrop: (p) => {
      const data = p.getData() as { columns: ColumnProReact[] };
      const column = data?.columns?.[0];
      document.body.classList.remove("lng1771-drag-on");
      if (!column) return;

      const id = column.id;

      grid.state.rowGroupModel.set((prev) => [...prev, id]);
      grid.api.columnUpdate(column, { hide: true });
    },
  });

  const canDropEither = canDrop || canDropNative;

  const combined = useCombinedRefs(dropRef, ref);

  const store = useDragStore();
  const isActive = useDrag(store, (s) => !!s.active);

  const re = useEdgeScroll({ isActive: isActive, direction: "horizontal" });

  const allRefs = useCombinedRefs(re, combined);

  return (
    <div
      {...props}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={clsx("lng1771-pill-manager__pills", props.className)}
      data-is-drop-target={isTarget}
      ref={allRefs}
      data-pill-source={pillSource}
      data-drop-visible={canDropEither && sourceItems.filter((c) => c.active).length === 0}
      tabIndex={-1}
    >
      <div className="lng1771-pill-manager__pills-inner">
        {children({ pills: sourceItems })}
        {canDropEither && isNearestOver && sourceItems.filter((c) => c.active).length > 0 && (
          <div className="lng1771-pill-manager__drop-indicator-end" />
        )}
      </div>
    </div>
  );
});
