import { useMemo } from "react";
import type { PillsProps } from "./pill-manager-pills";
import type { PillManagerPillItem } from "../pill-manager";
import { useGrid } from "../../use-grid";

export function useAggregationSource(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const columns = sx.columns.use();
  const aggModel = sx.aggModel.use();

  return useMemo(() => {
    if (source !== "aggregations") return [];

    const entries = Object.entries(aggModel);

    const active: PillManagerPillItem[] = [];
    for (const [key, m] of entries) {
      let column = api.columnById(key) ?? null;
      if (column && (api.columnIsPivot(column) || api.columnIsGridGenerated(column))) column = null;

      const secondaryLabel = typeof m.fn === "string" ? `(${m.fn})` : "Fn(x)";
      const onToggle = () =>
        sx.aggModel.set((prev) => {
          const next = { ...prev };
          delete next[key];

          return next;
        });

      if (column) {
        active.push({
          kind: "column",
          active: true,
          label: column.headerName ?? column.id,
          secondaryLabel,
          onClick: onToggle,
          draggable: false,
          dragTags: [],
        });
      } else {
        active.push({
          kind: "column",
          active: true,
          label: key,
          secondaryLabel,
          onClick: onToggle,
          draggable: false,
          dragTags: [],
        });
      }
    }

    const base = sx.columnBase.peek();
    const inactive = columns
      .filter((c) => {
        const agg =
          c.aggFn ??
          c.aggFnDefault ??
          c.aggFnsAllowed?.length ??
          base.aggFn ??
          base.aggFnsAllowed?.length;
        const isAgged = !!aggModel[c.id];

        return !!agg && !isAgged && typeof (c.field ?? c.id) === "string";
      })
      .map<PillManagerPillItem>((c) => {
        const aggFn =
          c.aggFn ??
          c.aggFnDefault ??
          c.aggFnsAllowed?.[0] ??
          base.aggFn ??
          base.aggFnsAllowed?.at(0);

        const onToggle = () =>
          sx.aggModel.set((prev) =>
            aggFn ? { ...prev, [c.id]: { field: (c.field ?? c.id) as string, fn: aggFn } } : prev,
          );

        const aggName = typeof aggFn === "string" ? `(${aggFn})` : "Fn(x)";

        return {
          kind: "column",
          label: c.headerName ?? c.id,
          active: false,
          secondaryLabel: aggName,
          onClick: onToggle,
          draggable: false,
          dragTags: [],
        };
      });

    return [...active, ...inactive];
  }, [aggModel, api, columns, source, sx.aggModel, sx.columnBase]);
}
