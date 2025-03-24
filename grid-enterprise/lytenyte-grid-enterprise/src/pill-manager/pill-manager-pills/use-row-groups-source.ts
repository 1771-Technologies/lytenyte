import { useMemo } from "react";
import { useGrid } from "../../use-grid";
import type { DragTag, PillManagerPillItem, PillsProps } from "../pill-manager-types";
import { canAgg, canMeasure } from "./utils";
import type { DragActive } from "@1771technologies/lytenyte-grid-community/internal";

export function useRowGroupsSource(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const rowModel = sx.rowGroupModel.use();
  const columns = sx.columns.use();
  const aggModel = sx.aggModel.use();
  const measureModel = sx.measureModel.use();
  const base = sx.columnBase.use();

  return useMemo(() => {
    if (source !== "row-groups") return [];
    const activeItems = rowModel
      .map((c) => api.columnById(c)!)
      .map<PillManagerPillItem>((c) => {
        const onToggle = () => sx.rowGroupModel.set((prev) => prev.filter((x) => x !== c.id));
        const dragTags: DragTag[] = ["row-group"];
        if (!api.columnIsVisible(c)) dragTags.push("columns");
        if (api.columnIsPivotable(c)) dragTags.push("column-pivot");
        if (!aggModel[c.id] && canAgg(c, base)) dragTags.push("aggregations");
        if (!measureModel[c.id] && canMeasure(c, base)) dragTags.push("measures");

        const dragEnd = (d: DragActive) => {
          const over = d.over.at(-1);
          if (!over || !over.canDrop) return;

          const isBefore = (sx.rtl.peek() ? "right" : "left") === over.xHalf;
          if (over.data.target === "row-group") {
            const id = over.data.id;
            if (id === c.id) return;

            const myIndex = rowModel.indexOf(c.id);
            const next = [...rowModel];

            next.splice(myIndex, 1);

            const targetIndex = next.indexOf(id);
            next.splice(targetIndex + (isBefore ? 0 : 1), 0, c.id);

            sx.rowGroupModel.set(next);
            return;
          }

          if (over.data.target === "columns") {
            const id = over.data.id;
            if (id === c.id) return;

            api.columnUpdate(c, { hide: false });

            if (isBefore) api.columnMoveBefore([c.id], id);
            else api.columnMoveAfter([c.id], id);
            sx.rowGroupModel.set((prev) => prev.filter((x) => x !== c.id));
            return;
          }
          if (over.id === "columns-pills") {
            api.columnUpdate(c, { hide: false });
            api.columnMoveToVisibleIndex([c.id], 0);
            sx.rowGroupModel.set((prev) => prev.filter((x) => x !== c.id));
            return;
          }
        };

        return {
          kind: "row-group",
          label: c.headerName ?? c.id,
          active: true,
          onClick: onToggle,

          draggable: true,
          dragEnd,
          dragTags: dragTags,
          dropTags: ["row-group"],
          dropData: { target: "row-group", id: c.id },
          dropId: `row-group-${c.id}`,
        };
      });

    const inactiveItems = columns
      .filter((c) => api.columnIsRowGroupable(c) && !rowModel.includes(c.id))
      .map<PillManagerPillItem>((c) => {
        const onToggle = () => sx.rowGroupModel.set((prev) => [...prev, c.id]);
        return {
          kind: "row-group",
          label: c.headerName ?? c.id,
          active: false,
          onClick: onToggle,

          draggable: false,
          dragTags: [],
          dropTags: [],
          dropData: {},
          dropId: `row-group-${c.id}`,
        };
      });

    return [...activeItems, ...inactiveItems];
  }, [aggModel, api, base, columns, measureModel, rowModel, source, sx.rowGroupModel, sx.rtl]);
}
