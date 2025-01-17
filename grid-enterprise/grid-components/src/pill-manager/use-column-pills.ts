import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";
import { useEvent } from "@1771technologies/react-utils";

export function useColumnPills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();

  const columns = sx.columns.use();
  const base = sx.columnBase.use();

  const pillItems = useMemo(() => {
    const hidden: ColumnEnterpriseReact<any>[] = [];
    const visible: ColumnEnterpriseReact<any>[] = [];

    const normalColumns = columns.filter((c) => !api.columnIsGridGenerated(c));

    for (let i = 0; i < normalColumns.length; i++) {
      const c = normalColumns[i];
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
  }, [api, base.hide, columns]);

  const onPillSelect = useEvent((p: PillRowItem) => {
    if (!api.columnIsHidable(p.column)) return;

    const nextState = !(p.column.hide ?? base.hide ?? false);

    api.columnUpdate(p.column, { hide: nextState });
  });

  return { pillItems, onPillSelect };
}
