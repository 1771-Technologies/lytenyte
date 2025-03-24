import { useMemo } from "react";
import { useGrid } from "../../use-grid";
import type { DragActive } from "@1771technologies/lytenyte-grid-community/internal";
import type { DragTag, PillManagerPillItem, PillsProps } from "../pill-manager-types";
import { canAgg, canMeasure } from "./utils";

export function useColumnSource(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const columns = sx.columns.use();
  const pivotModel = sx.columnPivotModel.use();
  const aggModel = sx.aggModel.use();
  const groupModel = sx.rowGroupModel.use();
  const measureModel = sx.measureModel.use();
  const base = sx.columnBase.use();

  return useMemo(() => {
    if (source !== "columns") return [];

    const active: PillManagerPillItem[] = [];
    const inactive: PillManagerPillItem[] = [];

    for (const c of columns) {
      if (api.columnIsGridGenerated(c)) continue;

      if (api.columnIsVisible(c, true)) {
        const onToggle = () => api.columnUpdate(c, { hide: true });

        const dragTags: DragTag[] = ["columns"];

        if (api.columnIsPivotable(c) && !pivotModel.includes(c.id)) dragTags.push("column-pivot");
        if (api.columnIsRowGroupable(c) && !groupModel.includes(c.id)) dragTags.push("row-group");
        if (!aggModel[c.id] && canAgg(c, base)) dragTags.push("aggregations");
        if (!measureModel[c.id] && canMeasure(c, base)) dragTags.push("measures");

        const dragEnd = (d: DragActive) => {
          const over = d.over.at(-1);
          if (!over || !over.canDrop) return;

          // Reorder columns
          if (over.data.target === "columns") {
            const id = over.data.id;
            if (id === c.id) return;
            const isBefore = (sx.rtl.peek() ? "right" : "left") === over.xHalf;

            if (isBefore) api.columnMoveBefore([c.id], id);
            else api.columnMoveAfter([c.id], id);
            return;
          }

          if (over.id === "row-groups-pills") {
            sx.rowGroupModel.set((prev) => [...prev, c.id]);
            api.columnUpdate(c, { hide: true });
            return;
          }

          if (over.data.target === "row-group") {
            const id = over.data.id;
            api.columnUpdate(c, { hide: true });
            const model = sx.rowGroupModel.peek();
            const isBefore = (sx.rtl.peek() ? "right" : "left") === over.xHalf;
            const index = model.indexOf(id);
            const nextModel = [...model];
            nextModel.splice(isBefore ? index : index + 1, 0, c.id);

            sx.rowGroupModel.set(nextModel);
            return;
          }

          if (over.id === "column-pivots-pills") {
            sx.columnPivotModel.set((prev) => [...prev, c.id]);
            api.columnUpdate(c, { hide: true });
            return;
          }

          if (over.data.target === "column-pivot") {
            const id = over.data.id;
            api.columnUpdate(c, { hide: true });
            const model = sx.columnPivotModel.peek();
            const isBefore = (sx.rtl.peek() ? "right" : "left") === over.xHalf;
            const index = model.indexOf(id);
            const nextModel = [...model];
            nextModel.splice(isBefore ? index : index + 1, 0, c.id);

            sx.columnPivotModel.set(nextModel);
            return;
          }

          if (over.id === "aggregations-pills") {
            const aggFn = c.aggFnDefault ?? c.aggFnsAllowed?.at(0) ?? base.aggFnsAllowed?.at(0);
            if (!aggFn) return;

            sx.aggModel.set((prev) => ({ ...prev, [c.id]: { fn: aggFn } }));
            return;
          }

          if (over.id === "measures-pills") {
            const measureFn =
              c.measureFnDefault ?? c.measureFnsAllowed?.at(0) ?? base.measureFnsAllowed?.at(0);
            if (!measureFn) return;

            sx.measureModel.set((prev) => ({ ...prev, [c.id]: { fn: measureFn } }));
            return;
          }
        };

        active.push({
          kind: "column",
          active: true,
          label: c.headerName ?? c.id,
          onClick: onToggle,

          draggable: api.columnIsMovable(c),
          dragTags,
          dragEnd,

          dropId: `column-${c.id}`,
          dropTags: ["columns"],
          dropData: {
            target: "columns",
            id: c.id,
          },
        });
      } else {
        const onToggle = () => api.columnUpdate(c, { hide: false });
        inactive.push({
          kind: "column",
          active: false,
          label: c.headerName ?? c.id,
          onClick: onToggle,

          dropId: `column-${c.id}`,
          draggable: false,
          dragTags: [],
          dropTags: [],
          dropData: {},
        });
      }
    }

    return [...active, ...inactive];
  }, [
    aggModel,
    api,
    base,
    columns,
    groupModel,
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
