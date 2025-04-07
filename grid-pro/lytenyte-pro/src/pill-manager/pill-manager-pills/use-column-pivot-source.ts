import { useMemo } from "react";
import { useGrid } from "../../use-grid";
import type { DragTag, PillManagerPillItem, RowProps } from "../pill-manager-types";
import { canAgg, canMeasure } from "./utils";
import type { DragActive } from "@1771technologies/lytenyte-grid-community/internal";

export function useColumnPivotSource(
  source: RowProps["pillSource"],
  dir: "vertical" | "horizontal" = "horizontal",
) {
  const { api, state: sx } = useGrid();

  const columns = sx.columns.use();
  const pivotModel = sx.columnPivotModel.use();
  const aggModel = sx.aggModel.use();
  const measureModel = sx.measureModel.use();
  const base = sx.columnBase.use();

  return useMemo(() => {
    if (source !== "column-pivots") return [];

    const appliedPivots = new Set(pivotModel);
    const canBePivoted = columns.filter(
      (c) => !appliedPivots.has(c.id) && api.columnIsPivotable(c),
    );
    const pivotedColumns = pivotModel.map((c) => api.columnById(c)!);

    const activeItems = pivotedColumns.map<PillManagerPillItem>((c) => {
      const onToggle = () => sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));

      const dragTags: DragTag[] = ["column-pivot"];
      if (api.columnIsRowGroupable(c)) dragTags.push("row-group");
      if (!api.columnIsVisible(c, true)) dragTags.push("columns");
      if (!aggModel[c.id] && canAgg(c, base)) dragTags.push("aggregations");
      if (!measureModel[c.id] && canMeasure(c, base)) dragTags.push("measures");

      const dragEnd = (d: DragActive) => {
        const over = d.over.at(-1);
        if (!over || !over.canDrop) return;

        const isBefore =
          dir === "horizontal"
            ? (sx.rtl.peek() ? "right" : "left") === over.xHalf
            : over.yHalf === "top";

        if (over.data.target === "column-pivot") {
          const id = over.data.id;
          if (id === c.id) return;

          const myIndex = pivotModel.indexOf(c.id);
          const next = [...pivotModel];

          next.splice(myIndex, 1);

          const targetIndex = next.indexOf(id);
          next.splice(targetIndex + (isBefore ? 0 : 1), 0, c.id);

          sx.columnPivotModel.set(next);
          return;
        }

        if (over.id === "columns-pills") {
          api.columnUpdate(c, { hide: false });
          api.columnMoveToVisibleIndex([c.id], 0);
          sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));
          return;
        }

        if (over.data.target === "columns") {
          const id = over.data.id;
          if (id === c.id) return;
          api.columnUpdate(c, { hide: false });

          if (isBefore) api.columnMoveBefore([c.id], id);
          else api.columnMoveAfter([c.id], id);
          sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));
          return;
        }

        if (over.id === "row-groups-pills") {
          sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));
          sx.rowGroupModel.set((prev) => [...prev, c.id]);
          return;
        }

        if (over.data.target === "row-group") {
          const id = over.data.id;
          if (id === c.id) return;
          sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));

          sx.rowGroupModel.set((prev) => {
            const next = [...prev];
            const index = next.indexOf(id) + (isBefore ? 0 : 1);
            next.splice(index, 0, c.id);

            return next;
          });
        }

        if (over.id === "aggregations-pills") {
          const aggFn = c.aggFnDefault ?? c.aggFnsAllowed?.at(0) ?? base.aggFnsAllowed?.at(0);
          if (!aggFn) return;

          sx.aggModel.set((prev) => ({ ...prev, [c.id]: { fn: aggFn } }));
          sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));
        }

        if (over.id === "measures-pills") {
          const measureFn =
            c.measureFnDefault ?? c.measureFnsAllowed?.at(0) ?? base.measureFnsAllowed?.at(0);
          if (!measureFn) return;

          sx.measureModel.set((prev) => ({ ...prev, [c.id]: { fn: measureFn } }));
          sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));
        }
      };

      return {
        kind: "column-pivot",
        label: c.headerName ?? c.id,
        active: true,
        onClick: onToggle,

        dragEnd,
        dropId: `pivot-${c.id}`,
        draggable: true,
        isColumnPivot: true,
        dragTags: dragTags,
        dropTags: ["column-pivot"],
        dropData: { target: "column-pivot", id: c.id },
      };
    });

    const inactiveItems = canBePivoted.map<PillManagerPillItem>((c) => {
      const onToggle = () => sx.columnPivotModel.set((prev) => [...prev, c.id]);
      return {
        kind: "column-pivot",
        label: c.headerName ?? c.id,
        active: false,
        onClick: onToggle,

        draggable: false,
        dropId: `pivot-${c.id}`,
        dragTags: [],
        dropTags: [],
        dropData: {},
      };
    });

    return [...activeItems, ...inactiveItems];
  }, [
    aggModel,
    api,
    base,
    columns,
    dir,
    measureModel,
    pivotModel,
    source,
    sx.aggModel,
    sx.columnPivotModel,
    sx.measureModel,
    sx.rowGroupModel,
    sx.rtl,
  ]);
}
