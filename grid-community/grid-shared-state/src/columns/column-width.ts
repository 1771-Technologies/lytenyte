import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import { sizeFromCoord } from "@1771technologies/js-utils";

export const columnVisualWidth = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  const index = api.columnIndex(c as any);
  if (index == null) return 0;

  return sizeFromCoord(index, api.getState().columnPositions.peek());
};
