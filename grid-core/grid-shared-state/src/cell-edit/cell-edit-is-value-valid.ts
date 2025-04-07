import type { ApiCore, CellEditLocationCore } from "@1771technologies/grid-types/core";
import { cellEditParser } from "./cell-edit-parser";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const cellEditIsValueValid = <D, E>(
  a: ApiCore<D, E> | ApiPro<D, E>,
  l: CellEditLocationCore,
) => {
  const api = a as ApiCore<D, E>;
  const s = api.getState();
  const column = s.columnsVisible.peek()[l.columnIndex];
  const row = api.rowByIndex(l.rowIndex);

  if (!column || !row) return false;

  const value = api.cellEditValue(l);
  try {
    const parser = cellEditParser(api, l.columnIndex);
    parser!({ api, column, row, value });

    return true;
  } catch {
    return false;
  }
};
