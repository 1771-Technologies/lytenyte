import type { ColumnView, RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import type { Column } from "../../../../types/index.js";

export function useEditUpdateCells(
  props: Root.Props,
  api: Root.API,
  source: RowSource,
  view: ColumnView,
): Root.API["editUpdateCells"] {
  return useEvent((updates) => {
    const updateMap = new Map<string | number, unknown>();

    updates.forEach((updates, key) => {
      const row = typeof key === "number" ? source.rowByIndex(key).get() : source.rowById(key);
      if (!row) return;

      let nextData = structuredClone(row.data) as any;

      for (const { column: c, value } of updates) {
        let column: Column | undefined;
        if (typeof c === "string") column = view.lookup.get(c);
        else if (typeof c === "number") column = view.visibleColumns.at(c);
        else column = view.lookup.get(c.id);

        if (!column) continue;

        const setter = ((column as any) ?? props.columnBase)?.editSetter as Root.Column["editSetter"];

        if (setter) {
          nextData = setter({ api, column, editData: nextData, editValue: value, row });
        } else {
          const field = ((column as any).field ?? column.id) as Root.Column["field"];
          if (typeof field !== "number" && typeof field !== "string") return false;
          nextData[field] = value;
        }
      }

      updateMap.set(key, nextData);
    });

    return api.editUpdateRows(updateMap);
  });
}
