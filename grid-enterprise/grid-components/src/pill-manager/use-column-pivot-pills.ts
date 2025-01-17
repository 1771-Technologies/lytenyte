import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";

export function useColumnPivotPills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();

  const columns = sx.columns.use();
  const model = sx.columnPivotModel.use();

  const pillItems = useMemo(() => {
    return columns
      .filter((c) => api.columnIsPivotable(c))
      .map<PillRowItem>((c) => {
        return {
          id: c.id,
          column: c,
          kind: "pivot",
          inactive: !model.includes(c.id),
        };
      });
  }, [api, columns, model]);

  return { pillItems };
}
