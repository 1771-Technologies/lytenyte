import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsEditable = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  if (api.columnIsGridGenerated(c as any)) return false;

  const base = api.getState().columnBase.peek();
  const predicateValue = c.cellEditPredicate ?? base.cellEditPredicate ?? false;

  return predicateValue !== false;
};
