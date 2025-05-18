import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsMovable = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  const base = api.getState().columnBase.peek();

  return c.movable ?? base.movable ?? false;
};
