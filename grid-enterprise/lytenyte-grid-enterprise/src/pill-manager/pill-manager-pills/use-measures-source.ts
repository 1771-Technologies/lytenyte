import { useMemo } from "react";
import type { PillsProps } from "./pill-manager-pills";
import type { PillManagerPillItem } from "../pill-manager";
import { useGrid } from "../../use-grid";

export function useMeasuresSource(source: PillsProps["pillSource"]) {
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
        const measure =
          c.measureFn ??
          c.measureFnDefault ??
          c.measureFnsAllowed?.length ??
          base.measureFn ??
          base.measureFnsAllowed?.length;
        const isMeasured = !!measureModel[c.id];

        return !!measure && !isMeasured && typeof (c.field ?? c.id) === "string";
      })
      .map<PillManagerPillItem>((c) => {
        const measureFn =
          c.measureFn ??
          c.measureFnDefault ??
          c.measureFnsAllowed?.[0] ??
          base.measureFn ??
          base.measureFnsAllowed?.at(0);

        const measureName = typeof measureFn === "string" ? `(${measureFn})` : "Fn(x)";

        const onToggle = () =>
          sx.measureModel.set((prev) =>
            measureFn
              ? { ...prev, [c.id]: { field: (c.field ?? c.id) as string, fn: measureFn } }
              : prev,
          );

        return {
          kind: "column",
          label: c.headerName ?? c.id,
          active: false,
          secondaryLabel: measureName,
          onClick: onToggle,
          draggable: false,
          dragTags: [],
        };
      });

    return [...active, ...inactive];
  }, [api, columns, measureModel, source, sx.columnBase, sx.measureModel]);
}
