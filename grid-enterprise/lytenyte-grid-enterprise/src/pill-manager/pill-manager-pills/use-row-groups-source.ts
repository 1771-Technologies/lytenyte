import { useMemo } from "react";
import { useGrid } from "../../use-grid";
import type { PillManagerPillItem, PillsProps } from "../pill-manager-types";

export function useRowGroupsSource(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const rowModel = sx.rowGroupModel.use();
  const columns = sx.columns.use();

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
          onClick: onToggle,

          draggable: false,
          dragTags: [],
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
  }, [api, columns, rowModel, source, sx.rowGroupModel]);
}
