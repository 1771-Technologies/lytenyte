import { useMemo } from "react";
import type { PillsProps } from "./pill-manager-pills";
import type { PillManagerPillItem } from "../pill-manager";
import { useGrid } from "../../use-grid";

export function useColumnPivotSource(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const columns = sx.columns.peek();
  const pivotModel = sx.columnPivotModel.peek();

  return useMemo(() => {
    if (source !== "column-pivots") return [];

    const appliedPivots = new Set(pivotModel);
    const canBePivotted = columns.filter(
      (c) => !appliedPivots.has(c.id) && api.columnIsPivotable(c),
    );
    const pivttedColumns = pivotModel.map((c) => api.columnById(c)!);

    const activeItems = pivttedColumns.map<PillManagerPillItem>((c) => {
      const onToggle = () => sx.columnPivotModel.set((prev) => prev.filter((x) => x !== c.id));
      return {
        kind: "column-pivot",
        label: c.headerName ?? c.id,
        active: true,
        onToggle,
      };
    });

    const inactiveItems = canBePivotted.map<PillManagerPillItem>((c) => {
      const onToggle = () => sx.columnPivotModel.set((prev) => [...prev, c.id]);
      return {
        kind: "column-pivot",
        label: c.headerName ?? c.id,
        active: false,
        onToggle,
      };
    });

    return [...activeItems, ...inactiveItems];
  }, [api, columns, pivotModel, source, sx.columnPivotModel]);
}
