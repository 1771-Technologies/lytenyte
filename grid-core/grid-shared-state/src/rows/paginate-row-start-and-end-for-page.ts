import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const paginateRowStartAndEndForPage = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  i: number,
) => {
  return api.getState().internal.rowBackingDataSource.peek().paginateRowStartAndEndForPage(i);
};
