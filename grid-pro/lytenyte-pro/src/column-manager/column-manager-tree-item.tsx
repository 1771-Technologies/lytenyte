import { forwardRef, useId, useMemo, type JSX } from "react";
import type { ListViewItemRendererProps } from "../list-view/list-view";
import { useGrid } from "../use-grid";
import { ArrowDownIcon, ArrowRightIcon, DragIcon } from "../icons";
import { Checkbox, useDraggable, useDroppable } from "@1771technologies/lytenyte-core/internal";
import { allLeafs } from "./utils/all-leafs";
import { clsx } from "@1771technologies/js-utils";
import { useCombinedRefs } from "@1771technologies/react-utils";
import { canAgg, canMeasure } from "../pill-manager/pill-manager-pills/utils";
import type { ColumnProReact } from "../types";

export const ColumnManagerTreeItem = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & {
    columnItem: ListViewItemRendererProps<ColumnProReact<any>>;
    depthPadding?: number;
  }
>(function TreeItem({ className, depthPadding = 12, style, columnItem: ci, ...props }, ref) {
  const { api, state } = useGrid();
  const base = state.columnBase.use();
  const columns = state.internal.columnLookup.use();
  const pivotMode = state.columnPivotModeIsOn.use();
  const labelId = useId();

  const pivotModel = state.columnPivotModel.use();
  const aggModel = state.aggModel.use();
  const groupModel = state.rowGroupModel.use();
  const measureModel = state.measureModel.use();

  const dropData = useMemo(() => {
    const ids = ci.data.type === "leaf" ? [ci.data.data.id] : allLeafs(ci.data).map((c) => c.id);
    return { target: "columns", ids, isGroup: ci.data.type === "parent" };
  }, [ci.data]);

  const { onPointerDown } = useDraggable({
    id: ci.data.type === "leaf" ? ci.data.data.id : ci.data.occurrence,
    getData: () => {
      const columns = ci.data.type === "leaf" ? [ci.data.data] : allLeafs(ci.data);
      return { target: "columns", columns };
    },
    getTags: () => {
      const columns = ci.data.type === "leaf" ? [ci.data.data] : allLeafs(ci.data);
      const isPivotable =
        columns.every((c) => api.columnIsPivotable(c)) &&
        columns.some((c) => !pivotModel.includes(c.id));
      const isGroupable =
        columns.every((c) => api.columnIsRowGroupable(c)) &&
        columns.some((c) => !groupModel.includes(c.id));
      const isAggregable =
        columns.every((c) => canAgg(c, base)) && columns.some((c) => !aggModel[c.id]);
      const isMeasurable =
        columns.every((c) => canMeasure(c, base)) && columns.some((c) => !measureModel[c.id]);

      const dragTags = ["columns"];
      if (isPivotable) dragTags.push("column-pivot");
      if (isGroupable) dragTags.push("row-group");
      if (isAggregable) dragTags.push("aggregations");
      if (isMeasurable) dragTags.push("measures");

      return dragTags;
    },

    onDragEnd: (p) => {
      const data = p.data as { target: string; columns: ColumnProReact<any>[] };

      const over = p.over.at(-1);
      if (!over) return;

      if (over.data.target === "columns") {
        const ids = over.data.ids;
        const isGroup = over.data.isGroup;
        const srcIds = data.columns.map((c) => c.id);
        if (srcIds.some((c) => ids.includes(c))) return;

        if (isGroup || over.yHalf === "top") api.columnMoveBefore(srcIds, ids[0]);
        else api.columnMoveAfter(srcIds, ids[0]);
        return;
      }

      if (over.id === "row-groups-pills") {
        const columns = data.columns.filter((c) => !groupModel.includes(c.id));
        state.rowGroupModel.set((prev) => [...prev, ...columns.map((c) => c.id)]);
        return;
      }

      if (over.id === "column-pivots-pills") {
        const columns = data.columns.filter((c) => !pivotModel.includes(c.id));
        state.columnPivotModel.set((prev) => [...prev, ...columns.map((c) => c.id)]);
        return;
      }

      if (over.id === "aggregations-pills") {
        const columns = Object.fromEntries(
          data.columns
            .filter((c) => !aggModel[c.id])
            .map((c) => {
              const aggFn = c.aggFnDefault ?? c.aggFnsAllowed?.at(0) ?? base.aggFnsAllowed?.at(0);

              return [c.id, { fn: aggFn! }] as const;
            }),
        );

        state.aggModel.set((prev) => ({ ...prev, ...columns }));
        return;
      }

      if (over.id === "measures-pills") {
        const columns = Object.fromEntries(
          data.columns
            .filter((c) => !measureModel[c.id])
            .map((c) => {
              const measureFn =
                c.measureFnDefault ?? c.measureFnsAllowed?.at(0) ?? base.measureFnsAllowed?.at(0);

              return [c.id, { fn: measureFn! }] as const;
            }),
        );

        state.measureModel.set((prev) => ({ ...prev, ...columns }));
        return;
      }
    },
  });

  const {
    ref: dropRef,
    canDrop,
    yHalf,
  } = useDroppable({
    id: ci.data.type === "leaf" ? ci.data.data.id : ci.data.occurrence,
    accepted: ["columns"],
    data: dropData,
  });

  const combinedRefs = useCombinedRefs(ref, dropRef);

  if (ci.data.type === "leaf") {
    const data = ci.data.data;
    const column = columns.get(data.id)!;
    if (!column) return null;

    const hidden = column.hide ?? base.hide;
    const hidable = !pivotMode && api.columnIsHidable(column);

    return (
      <div
        {...props}
        className={clsx("lng1771-column-manager__tree-item", className)}
        ref={combinedRefs}
        data-can-drop={canDrop}
        style={{
          paddingInlineStart: `calc(${depthPadding}px + ${ci.depth > 0 ? ci.depth + 1 : 0} * ${depthPadding}px + 22px)`,
          ...style,
        }}
      >
        {canDrop && yHalf === "top" && (
          <div className="lng1771-column-manager__tree-item-drop-indicator-top" />
        )}
        {canDrop && yHalf === "bottom" && (
          <div className="lng1771-column-manager__tree-item-drop-indicator-bottom" />
        )}
        <DragIcon width={16} height={16} onPointerDown={onPointerDown} />
        <Checkbox
          htmlFor={labelId}
          aria-labelledby={labelId}
          isDisabled={!hidable}
          tabIndex={-1}
          isChecked={!hidden}
          disabled={!hidable}
        />

        <label id={labelId}>{data.headerName ?? data.id}</label>
      </div>
    );
  } else {
    const id = ci.data.occurrence;
    const path = ci.data.path.at(-1)!;

    const columns = allLeafs(ci.data);
    const checked = columns.every((c) => !(c.hide ?? base.hide));
    const isIndeterminate = columns.some((c) => !(c.hide ?? base.hide)) && !checked;

    const hidable = !pivotMode && columns.every((c) => api.columnIsHidable(c));

    return (
      <div
        {...props}
        style={{
          paddingInlineStart: `calc(${depthPadding}px + ${ci.depth} * ${depthPadding}px)`,
          ...style,
        }}
        ref={combinedRefs}
        className={clsx("lng1771-column-manager__tree-item", className)}
      >
        {canDrop && yHalf === "top" && (
          <div className="lng1771-column-manager__tree-item-drop-indicator-top" />
        )}
        {canDrop && yHalf === "bottom" && (
          <div className="lng1771-column-manager__tree-item-drop-indicator-bottom" />
        )}
        <button
          className="lng1771-column-manager__tree-item-expander"
          onFocus={(ev) => ev.currentTarget.blur()}
          onClick={(ev) => {
            ev.stopPropagation();
            state.internal.columnManagerTreeExpansions.set((prev) => ({
              ...prev,
              [id]: !ci.expanded,
            }));
          }}
        >
          {ci.expanded ? (
            <ArrowDownIcon width={16} height={16} id={id} />
          ) : (
            <ArrowRightIcon id={id} width={16} height={16} />
          )}
        </button>
        <DragIcon width={16} height={16} onPointerDown={onPointerDown} />
        <Checkbox
          htmlFor={labelId}
          aria-labelledby={labelId}
          tabIndex={-1}
          isDisabled={!hidable}
          isChecked={checked || isIndeterminate}
          isDeterminate={isIndeterminate}
        />

        <label id={labelId}>{path}</label>
      </div>
    );
  }
});
