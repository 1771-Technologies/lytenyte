import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";

export function useRowGroup(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();

  const columns = sx.columns.use();

  const pillItems = useMemo(() => {
    return columns
      .filter((c) => api.columnIsRowGroupable(c))
      .map<PillRowItem>((c) => {
        return {
          id: c.id,
          column: c,
        };
      });
  }, [api, columns]);

  return { pillItems };
}
