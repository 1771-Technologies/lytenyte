import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const paginateRowStartAndEndForPage = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  i: number,
) => {
  return api.getState().internal.rowBackingDataSource.peek().paginateRowStartAndEndForPage(i);
};
