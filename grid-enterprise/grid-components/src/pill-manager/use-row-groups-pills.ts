import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useCallback, useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";
import { useEvent } from "@1771technologies/react-utils";
import type { Signal } from "@1771technologies/react-cascada";
import type { DropParams } from "@1771technologies/react-dragon";

const containerTags = ["column-groupable"];
export function useRowGroupPills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();

  const columns = sx.columns.use();
  const model = sx.rowGroupModel.use();

  const pillItems = useMemo(() => {
    const inModel = model.map((c) => api.columnById(c)!);
    const outOfModel = columns.filter((c) => api.columnIsRowGroupable(c) && !model.includes(c.id));

    return [...inModel, ...outOfModel].map<PillRowItem>((c) => {
      return {
        id: c.id,
        column: c,
        kind: "group",
        inactive: !model.includes(c.id),
        dragTags: ["column-groupable"],
        dropTags: ["column-groupable"],
      };
    });
  }, [api, columns, model]);

  const onPillSelect = useEvent((p: PillRowItem) => {
    if (model.includes(p.id)) sx.rowGroupModel.set((prev) => prev.filter((c) => c !== p.id));
    else sx.rowGroupModel.set((prev) => [...prev, p.id]);
  });

  const onDrop = useDrop(model, sx.rowGroupModel, api);

  const onContainerDrop = useCallback(
    (p: DropParams) => {
      const dragged = p.getData() as { pillItem: PillRowItem };

      const column = dragged.pillItem.column;
      if (model.includes(column.id)) return;

      const next = [...model, column.id];

      api.columnUpdate(column, { hide: true });
      sx.rowGroupModel.set(next);
    },
    [api, model, sx.rowGroupModel],
  );

  return { pillItems, onPillSelect, onDrop, containerTags, onContainerDrop };
}

export function useDrop<D>(model: string[], signal: Signal<string[]>, api: ApiEnterpriseReact<D>) {
  const onDrop = useEvent((dragged: PillRowItem, over: PillRowItem, isBefore: boolean) => {
    const id = dragged.id;
    const target = over.id;
    const index = model.indexOf(id);

    const next = [...model];
    if (index !== -1) {
      next.splice(index, 1);
    }

    const targetIndex = next.indexOf(target);
    if (targetIndex === -1) return;

    if (index === -1) {
      // This means the item came from the columns row - so we should grab the column id and hide it.
      next.splice(targetIndex, 0, id);
      api.columnUpdate(dragged.column, { hide: true });
    } else if (isBefore) next.splice(targetIndex, 0, id);
    else next.splice(targetIndex + 1, 0, id);

    signal.set(next);
  });

  return onDrop;
}
