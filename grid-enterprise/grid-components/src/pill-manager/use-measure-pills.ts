import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";

export function useMeasurePills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();
  const columns = sx.columns.use();

  const measures = sx.measureModel.use();

  const pillItems = useMemo(() => {
    const inModel = measures.map((c) => api.columnById(c)!);
    const outOfModel = columns.filter((c) => api.columnIsMeasurable(c) && !measures.includes(c.id));

    return [...inModel, ...outOfModel].map<PillRowItem>((c) => {
      return {
        id: c.id,
        column: c,
        kind: "column",
        inactive: !measures.includes(c.id),
      };
    });
  }, [api, columns, measures]);

  return { pillItems };
}
