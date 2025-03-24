import { useMemo } from "react";
import { useGrid } from "../../use-grid";
import type { DragTag, PillManagerPillItem, PillsProps } from "../pill-manager-types";

export function useColumnPivotSource(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const columns = sx.columns.use();
  const pivotModel = sx.columnPivotModel.use();

  return useMemo(() => {
    if (source !== "column-pivots") return [];

    const appliedPivots = new Set(pivotModel);
    const canBePivoted = columns.filter(
      (c) => !appliedPivots.has(c.id) && api.columnIsPivotable(c),
    );
    const pivotedColumns = pivotModel.map((c) => api.columnById(c)!);

    const activeItems = pivotedColumns.map<PillManagerPillItem>((c) => {
      const onToggle = () => sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));

      const tags: DragTag[] = ["column-pivot"];
      if (api.columnIsRowGroupable(c)) tags.push("row-group");

      return {
        kind: "column-pivot",
        label: c.headerName ?? c.id,
        active: true,
        onClick: onToggle,

        dropId: `pivot-${c.id}`,
        draggable: true,
        dragTags: tags,
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
  }, [api, columns, pivotModel, source, sx.columnPivotModel]);
}
