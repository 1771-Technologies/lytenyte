import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";
import { useEvent } from "@1771technologies/react-utils";
import { useDrop } from "./use-row-groups-pills";

export function useMeasurePills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();
  const columns = sx.columns.use();

  const model = sx.measureModel.use();

  const pillItems = useMemo(() => {
    const inModel = model.map((c) => api.columnById(c)!);
    const outOfModel = columns.filter((c) => api.columnIsMeasurable(c) && !model.includes(c.id));

    return [...inModel, ...outOfModel].map<PillRowItem>((c) => {
      return {
        id: c.id,
        column: c,
        kind: "column",
        inactive: !model.includes(c.id),
        dragTag: "",
        dropTag: "",
      };
    });
  }, [api, columns, model]);

  const onPillSelect = useEvent((p: PillRowItem) => {
    if (model.includes(p.id)) sx.measureModel.set((prev) => prev.filter((c) => c !== p.id));
    else sx.measureModel.set((prev) => [...prev, p.id]);
  });

  const onDrop = useDrop(model, sx.measureModel);

  return { pillItems, onPillSelect, onDrop };
}
