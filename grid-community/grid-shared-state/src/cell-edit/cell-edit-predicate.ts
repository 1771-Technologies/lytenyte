import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";

export const cellEditPredicate = <D, E>(
  a: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  row: RowNode<D>,
  col: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  const c = col as ColumnCommunity<D, E>;
  const api = a as ApiCommunity<D, E>;

  if (api.columnIsGridGenerated(c)) return false;

  const base = api.getState().columnBase.peek();

  const editable = c.cellEditPredicate ?? base.cellEditPredicate;

  if (typeof editable === "function") return editable({ api, column: c, row });
  return api.rowIsLeaf(row) && !!editable;
};
