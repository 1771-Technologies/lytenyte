import { GROUP_COLUMN_PREFIX } from "@1771technologies/grid-constants";
import type { ColumnCore } from "@1771technologies/grid-types/core";
import type { ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsGroupAutoColumn = <D, E>(c: ColumnCore<D, E> | ColumnPro<D, E>) => {
  return c.id.startsWith(GROUP_COLUMN_PREFIX);
};
