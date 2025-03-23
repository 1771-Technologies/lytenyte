import { useMemo } from "react";
import type { PillsProps } from "./pill-manager-pills";
import type { PillManagerPillItem } from "../pill-manager";
import { useGrid } from "../../use-grid";

export function useRowGroupsSource(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const rowModel = sx.rowGroupModel.peek();
  const columns = sx.columns.peek();

  return useMemo(() => {
    if (source !== "row-groups") return [];
    const activeItems = rowModel
      .map((c) => api.columnById(c)!)
      .map<PillManagerPillItem>((c) => {
        const onToggle = () => sx.rowGroupModel.set((prev) => prev.filter((x) => x !== c.id));
        return {
          kind: "row-group",
          label: c.headerName ?? c.id,
          active: true,
          onToggle,
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
          onToggle,
        };
      });

    return [...activeItems, ...inactiveItems];
  }, [api, columns, rowModel, source, sx.rowGroupModel]);
}
