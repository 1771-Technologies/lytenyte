import { GROUP_COLUMN_PREFIX } from "@1771technologies/grid-constants";
import type { ColumnCommunity, ColumnEnterprise } from "@1771technologies/grid-types";

export const columnIsGroupAutoColumn = <D, E>(
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
) => {
  return c.id.startsWith(GROUP_COLUMN_PREFIX);
};
