import type { ApiCore, ColumnCore, RowNodeCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const cellEditPredicate = <D, E>(
  a: ApiCore<D, E> | ApiPro<D, E>,
  row: RowNodeCore<D>,
  col: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  const c = col as ColumnCore<D, E>;
  const api = a as ApiCore<D, E>;

  if (api.columnIsGridGenerated(c)) return false;

  const base = api.getState().columnBase.peek();

  const editable = c.cellEditPredicate ?? base.cellEditPredicate;

  if (typeof editable === "function") return editable({ api, column: c, row });
  return api.rowIsLeaf(row) && !!editable;
};
