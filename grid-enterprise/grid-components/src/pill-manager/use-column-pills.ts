import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";

export function useColumnPills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();

  const columns = sx.columns.use();
  const base = sx.columnBase.use();

  const pillItems = useMemo(() => {
    const hidden: ColumnEnterpriseReact<any>[] = [];
    const visible: ColumnEnterpriseReact<any>[] = [];

    for (let i = 0; i < columns.length; i++) {
      const c = columns[i];
      if (c.hide ?? base.hide ?? false) hidden.push(c);
      else visible.push(c);
    }

    const merged = [
      ...visible.map<PillRowItem>((c) => {
        return {
          column: c,
          id: c.id,
          kind: "column",
          inactive: false,
        };
      }),
      ...hidden.map<PillRowItem>((c) => {
        return {
          column: c,
          id: c.id,
          kind: "column",
          inactive: true,
        };
      }),
    ];

    return merged;
  }, [base.hide, columns]);

  return { pillItems };
}
