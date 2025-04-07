import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";
import { sizeFromCoord } from "@1771technologies/js-utils";

export const columnVisualWidth = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
) => {
  const index = api.columnIndex(c as any);
  if (index == null) return 0;

  return sizeFromCoord(index, api.getState().columnPositions.peek());
};
