import type { ApiCore, CellEditLocationCore } from "@1771technologies/grid-types/core";
import { cellEditKey } from "./cell-edit-key";
import { cellEditUnparser } from "./cell-edit-unparser";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export function cellEditBegin<D, E>(
  a: ApiCore<D, E> | ApiPro<D, E>,
  l: CellEditLocationCore,
  makeActive = true,
) {
  const api = a as ApiPro<D, E>;

  const row = api.rowByIndex(l.rowIndex);
  const column = api.columnByIndex(l.columnIndex);

  if (!row || !column) return;

  const canEdit = api.cellEditPredicate(row, column);
  if (!canEdit) return;

  const s = api.getState();
  const key = cellEditKey(l);
  const activeEdits = s.internal.cellEditActiveEdits.peek();

  if (makeActive) s.internal.cellEditActiveLocation.set(l);
  if (activeEdits.has(key)) return;

  const nextActiveInitial = new Map(s.internal.cellEditActiveInitialValues.peek());
  const nextActiveValues = new Map(s.internal.cellEditActiveEditValues.peek());
  const nextActiveEdits = new Map(s.internal.cellEditActiveEdits.peek());

  const locations = [l];

  const visible = s.columnsVisible.peek();
  for (const location of locations) {
    const key = cellEditKey(location);
    const column = visible[location.columnIndex];
    const unparser = cellEditUnparser(api, location.columnIndex)!;

    const field = api.columnField(row, column);
    const value = unparser({ api, column, row, value: field });

    nextActiveEdits.set(key, location);
    nextActiveValues.set(key, value);
    nextActiveInitial.set(key, value);
  }

  s.internal.cellEditActiveInitialValues.set(nextActiveInitial);
  s.internal.cellEditActiveEdits.set(nextActiveEdits);
  s.internal.cellEditActiveEditValues.set(nextActiveValues);

  api.eventFire("onCellEditBegin", { api, locations });
}
