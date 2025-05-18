import type { ApiCore } from "@1771technologies/grid-types/core";
import { cellEditKey } from "./cell-edit-key";
import { cellEditParser } from "./cell-edit-parser";
import type { ApiPro, CellEditLocationPro } from "@1771technologies/grid-types/pro";

export function cellEditHandleBulkEdit<D, E>(
  a: ApiCore<D, E> | ApiPro<D, E>,
  locations: CellEditLocationPro[],
  cancel: boolean,
) {
  const api = a as ApiCore<D, E>;
  const s = api.getState();

  const removeKeys = () => {
    const activeCellEdits = new Map(s.internal.cellEditActiveEdits.peek());
    const activeCellEditValues = new Map(s.internal.cellEditActiveEditValues.peek());
    const activeCellEditInitialValues = new Map(s.internal.cellEditActiveInitialValues.peek());

    for (const l of locations) {
      const key = cellEditKey(l);
      activeCellEdits.delete(key);
      activeCellEditValues.delete(key);
      activeCellEditInitialValues.delete(key);
    }

    return { activeCellEdits, activeCellEditValues, activeCellEditInitialValues };
  };

  if (cancel) {
    api.eventFire("onCellEditCancel", { api, locations });
    const r = removeKeys();
    s.internal.cellEditActiveEdits.set(r.activeCellEdits);
    s.internal.cellEditActiveInitialValues.set(r.activeCellEditInitialValues);
    s.internal.cellEditActiveEditValues.set(r.activeCellEditValues);
    return;
  }

  const rows = [...new Set(locations.map((l) => l.rowIndex))]
    .map((l) => api.rowByIndex(l))
    .filter((row) => row != null);

  const dataUpdates = Object.fromEntries(
    rows.map((r) => [r.id, structuredClone(r.data)] as [string, D]),
  );

  const visible = s.columnsVisible.peek();
  const base = s.columnBase.peek();
  const activeEditValues = s.internal.cellEditActiveEditValues.peek();
  const activeEditInitialValues = s.internal.cellEditActiveInitialValues.peek();

  for (const l of locations) {
    const column = visible[l.columnIndex];
    const row = api.rowByIndex(l.rowIndex);
    if (!row) continue;

    const key = cellEditKey(l);
    const newValue = activeEditValues.get(key);
    const oldValue = activeEditInitialValues.get(key);

    try {
      const parser = cellEditParser(api, l.columnIndex);
      const field = parser!({ api, column, row, value: newValue });

      const updater = column.cellEditRowUpdater ?? base.cellEditRowUpdater;
      if (updater) {
        updater({ api, column, row, value: field });
        continue;
      }
      if (!api.rowIsLeaf(row))
        throw new Error("An updater function must be provided when editing non-leaf rows");

      const fieldKey = column.field ?? column.id;
      if (typeof fieldKey === "string" || typeof fieldKey === "number") {
        const data = dataUpdates[row.id];

        // @ts-expect-error this should be fine, unless the data is misconfigured
        // by the user - in which case many things break.
        data[fieldKey] = field;

        api.eventFire("onCellEditSuccess", { api, newValue, oldValue, location: l });
        continue;
      }

      throw new Error(
        "An updater function must be provided when the column field is not a string or number",
      );
    } catch (e) {
      api.eventFire("onCellEditFailure", { api, newValue, oldValue, location: l, error: e });
    }
  }

  api.eventFire("onCellEditEnd", { api, locations });
  api.rowSetDataMany(dataUpdates);

  const r = removeKeys();
  s.internal.cellEditActiveEdits.set(r.activeCellEdits);
  s.internal.cellEditActiveInitialValues.set(r.activeCellEditInitialValues);
  s.internal.cellEditActiveEditValues.set(r.activeCellEditValues);
}
