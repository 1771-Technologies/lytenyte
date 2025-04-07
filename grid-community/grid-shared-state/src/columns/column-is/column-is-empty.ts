import { columnIsEmpty as ce } from "@1771technologies/grid-core";
import type { ColumnCore } from "@1771technologies/grid-types/core";
import type { ColumnPro } from "@1771technologies/grid-types/pro";

export const columnIsEmpty = <D, E>(c: ColumnCore<D, E> | ColumnPro<D, E>) => {
  return ce(c);
};
