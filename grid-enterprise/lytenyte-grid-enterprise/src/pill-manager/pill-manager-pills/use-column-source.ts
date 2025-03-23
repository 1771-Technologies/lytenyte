import { useMemo } from "react";
import type { PillsProps } from "./pill-manager-pills";
import type { DragTag, PillManagerPillItem } from "../pill-manager";
import { useGrid } from "../../use-grid";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";

export function useColumnSoruce(source: PillsProps["pillSource"]) {
  const { api, state: sx } = useGrid();

  const columns = sx.columns.use();
  const pivotModel = sx.columnPivotModel.use();
  const aggModel = sx.aggModel.use();
  const groupModel = sx.rowGroupModel.use();
  const measureModel = sx.measureModel.use();
  const base = sx.columnBase.use();

  return useMemo(() => {
    if (source !== "columns") return [];

    const active: PillManagerPillItem[] = [];
    const inactive: PillManagerPillItem[] = [];

    const canAgg = (c: ColumnEnterpriseReact<any>) => {
      return c.aggFnDefault ?? c.aggFnsAllowed?.length ?? base.aggFnsAllowed?.length;
    };
    const canMeasure = (c: ColumnEnterpriseReact<any>) => {
      return c.measureFnDefault ?? c.measureFnsAllowed?.length ?? base.measureFnsAllowed?.length;
    };

    for (const c of columns) {
      if (api.columnIsGridGenerated(c)) continue;

      if (api.columnIsVisible(c, true)) {
        const onToggle = () => api.columnUpdate(c, { hide: true });

        const dragTags: DragTag[] = ["columns"];

        if (api.columnIsPivotable(c) && !pivotModel.includes(c.id)) dragTags.push("column-pivot");
        if (api.columnIsRowGroupable(c) && !groupModel.includes(c.id)) dragTags.push("row-group");
        if (!aggModel[c.id] && canAgg(c)) dragTags.push("aggregations");
        if (!measureModel[c.id] && canMeasure(c)) dragTags.push("measures");

        active.push({
          kind: "column",
          active: true,
          label: c.headerName ?? c.id,
          onClick: onToggle,

          draggable: true,
          dragTags,
          dropTags: ["columns"],
        });
      } else {
        const onToggle = () => api.columnUpdate(c, { hide: false });
        inactive.push({
          kind: "column",
          active: false,
          label: c.headerName ?? c.id,
          onClick: onToggle,
          draggable: true,
          dragTags: [],
          dropTags: [],
        });
      }
    }

    return [...active, ...inactive];
  }, [
    aggModel,
    api,
    base.aggFnsAllowed?.length,
    base.measureFnsAllowed?.length,
    columns,
    groupModel,
    measureModel,
    pivotModel,
    source,
  ]);
}
