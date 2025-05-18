import { useMemo } from "react";
import { useGrid } from "../../use-grid";
import type { PillManagerPillItem, RowProps } from "../pill-manager-types";

export function useMeasuresSource(source: RowProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const columns = sx.columns.use();
  const measureModel = sx.measureModel.use();

  return useMemo(() => {
    if (source !== "measures") return [];

    const entries = Object.entries(measureModel);

    const active: PillManagerPillItem[] = [];
    for (const [key, m] of entries) {
      let column = api.columnById(key) ?? null;
      if (column && (api.columnIsPivot(column) || api.columnIsGridGenerated(column))) column = null;

      const secondaryLabel = typeof m.fn === "string" ? `(${m.fn})` : "Fn(x)";
      const onToggle = () =>
        sx.measureModel.set((prev) => {
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
          dropTags: [],
          dropData: {},
          column,
          isMeasure: true,
          dropId: `measure-${key}`,
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
          dropTags: [],
          dropData: {},
          dropId: `measure-${key}`,
        });
      }
    }

    const base = sx.columnBase.peek();
    const inactive = columns
      .filter((c) => {
        const measure =
          c.measureFnDefault ?? c.measureFnsAllowed?.length ?? base.measureFnsAllowed?.length;
        const isMeasured = !!measureModel[c.id];

        return !!measure && !isMeasured;
      })
      .map<PillManagerPillItem>((c) => {
        const measureFn =
          c.measureFnDefault ?? c.measureFnsAllowed?.[0] ?? base.measureFnsAllowed?.at(0);

        const measureName = typeof measureFn === "string" ? `(${measureFn})` : "Fn(x)";

        const onToggle = () =>
          sx.measureModel.set((prev) =>
            measureFn ? { ...prev, [c.id]: { fn: measureFn } } : prev,
          );

        return {
          kind: "column",
          label: c.headerName ?? c.id,
          active: false,
          secondaryLabel: measureName,
          onClick: onToggle,
          draggable: false,
          dragTags: [],
          dropTags: [],
          dropData: {},
          dropId: `measure-${c.id}`,
        };
      });

    return [...active, ...inactive];
  }, [api, columns, measureModel, source, sx.columnBase, sx.measureModel]);
}
