import { COLUMN_MARKER_ID } from "@1771technologies/grid-constants";
import type { ColumnCommunity, ColumnEnterprise } from "@1771technologies/grid-types";

export const columnIsMarker = <D, E>(c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>) => {
  return c.id === COLUMN_MARKER_ID;
};
