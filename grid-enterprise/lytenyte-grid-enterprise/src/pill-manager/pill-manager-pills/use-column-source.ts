import { useMemo } from "react";
import type { PillsProps } from "./pill-manager-pills";
import type { PillManagerPillItem } from "../pill-manager";
import { useGrid } from "../../use-grid";

export function useColumnSoruce(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const columns = sx.columns.use();

  return useMemo(() => {
    if (source !== "columns") return [];

    const active: PillManagerPillItem[] = [];
    const inactive: PillManagerPillItem[] = [];

    for (const c of columns) {
      if (api.columnIsGridGenerated(c)) continue;

      if (api.columnIsVisible(c, true)) {
        const onToggle = () => api.columnUpdate(c, { hide: true });

        active.push({
          kind: "column",
          active: true,
          label: c.headerName ?? c.id,
          onClick: onToggle,
        });
      } else {
        const onToggle = () => api.columnUpdate(c, { hide: false });
        inactive.push({
          kind: "column",
          active: false,
          label: c.headerName ?? c.id,
          onClick: onToggle,
        });
      }
    }

    return [...active, ...inactive];
  }, [api, columns, source]);
}
