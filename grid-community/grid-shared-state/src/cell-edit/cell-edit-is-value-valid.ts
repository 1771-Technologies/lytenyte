import type { CellEditLocation } from "@1771technologies/grid-types/core";
import { cellEditParser } from "./cell-edit-parser";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const cellEditIsValueValid = <D, E>(
  a: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  l: CellEditLocation,
) => {
  const api = a as ApiCommunity<D, E>;
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
