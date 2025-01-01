import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";

export const columnIsGridGenerated = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  if ("columnPivots" in api && api.columnIsPivot(c as ColumnEnterprise<D, E>)) return true;

  c = c as any;
  return (
    api.columnIsMarker(c as any) ||
    api.columnIsGroupAutoColumn(c as any) ||
    api.columnIsEmpty(c as any)
  );
};
