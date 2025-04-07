import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsGridGenerated = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  if ("columnPivots" in api && api.columnIsPivot(c as ColumnPro<D, E>)) return true;

  c = c as any;
  return (
    api.columnIsMarker(c as any) ||
    api.columnIsGroupAutoColumn(c as any) ||
    api.columnIsEmpty(c as any)
  );
};
