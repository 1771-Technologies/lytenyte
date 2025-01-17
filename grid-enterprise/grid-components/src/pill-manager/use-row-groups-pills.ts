import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";

export function useRowGroupPills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();

  const columns = sx.columns.use();
  const model = sx.rowGroupModel.use();

  const pillItems = useMemo(() => {
    return columns
      .filter((c) => api.columnIsRowGroupable(c))
      .map<PillRowItem>((c) => {
        return {
          id: c.id,
          column: c,
          kind: "group",
          inactive: !model.includes(c.id),
        };
      });
  }, [api, columns, model]);

  return { pillItems };
}
