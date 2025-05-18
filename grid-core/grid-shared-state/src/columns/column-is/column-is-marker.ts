import { COLUMN_MARKER_ID } from "@1771technologies/grid-constants";
import type { ColumnCore } from "@1771technologies/grid-types/core";
import type { ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsMarker = <D, E>(c: ColumnCore<D, E> | ColumnPro<D, E>) => {
  return c.id === COLUMN_MARKER_ID;
};
