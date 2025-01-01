import { columnIsEmpty as ce } from "@1771technologies/grid-core";
import type { ColumnCommunity, ColumnEnterprise } from "@1771technologies/grid-types";

export const columnIsEmpty = <D, E>(c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>) => {
  return ce(c);
};
