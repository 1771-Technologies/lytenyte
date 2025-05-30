import { useMemo } from "react";
import { useGrid } from "../../use-grid";
import type { PillManagerPillItem, RowProps } from "../pill-manager-types";

export function useAggregationSource(source: RowProps["pillSource"]) {
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
          dropId: `agg-${column.id}`,
          column: column,
          isAggregation: true,

          dropTags: [],
          dropData: {},
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

          dropId: `agg-${key}`,
          dropTags: [],
          dropData: {},
        });
      }
    }

    const base = sx.columnBase.peek();
    const inactive = columns
      .filter((c) => {
        const agg = c.aggFnDefault ?? c.aggFnsAllowed?.length ?? base.aggFnsAllowed?.length;
        const isAgged = !!aggModel[c.id];

        return !!agg && !isAgged;
      })
      .map<PillManagerPillItem>((c) => {
        const aggFn = c.aggFnDefault ?? c.aggFnsAllowed?.[0] ?? base.aggFnsAllowed?.at(0);

        const onToggle = () =>
          sx.aggModel.set((prev) => (aggFn ? { ...prev, [c.id]: { fn: aggFn } } : prev));

        const aggName = typeof aggFn === "string" ? `(${aggFn})` : "Fn(x)";

        return {
          kind: "column",
          label: c.headerName ?? c.id,
          active: false,
          secondaryLabel: aggName,
          onClick: onToggle,
          draggable: false,

          dropId: `agg-${c.id}`,
          dropTags: [],
          dragTags: [],
          dropData: {},
        };
      });

    return [...active, ...inactive];
  }, [aggModel, api, columns, source, sx.aggModel, sx.columnBase]);
}
