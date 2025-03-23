import { useMemo } from "react";
import type { PillsProps } from "./pill-manager-pills";
import type { DragTag, PillManagerPillItem } from "../pill-manager";
import { useGrid } from "../../use-grid";

export function useColumnPivotSource(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const columns = sx.columns.use();
  const pivotModel = sx.columnPivotModel.use();

  return useMemo(() => {
    if (source !== "column-pivots") return [];

    const appliedPivots = new Set(pivotModel);
    const canBePivotted = columns.filter(
      (c) => !appliedPivots.has(c.id) && api.columnIsPivotable(c),
    );
    const pivttedColumns = pivotModel.map((c) => api.columnById(c)!);

    const activeItems = pivttedColumns.map<PillManagerPillItem>((c) => {
      const onToggle = () => sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));

      const tags: DragTag[] = ["column-pivot"];
      if (api.columnIsRowGroupable(c)) tags.push("row-group");

      return {
        kind: "column-pivot",
        label: c.headerName ?? c.id,
        active: true,
        onClick: onToggle,

        draggable: true,
        dragTags: tags,
        dropTags: ["column-pivot"],
      };
    });

    const inactiveItems = canBePivotted.map<PillManagerPillItem>((c) => {
      const onToggle = () => sx.columnPivotModel.set((prev) => [...prev, c.id]);
      return {
        kind: "column-pivot",
        label: c.headerName ?? c.id,
        active: false,
        onClick: onToggle,

        draggable: false,
        dragTags: [],
        dropTags: [],
      };
    });

    return [...activeItems, ...inactiveItems];
  }, [api, columns, pivotModel, source, sx.columnPivotModel]);
}
