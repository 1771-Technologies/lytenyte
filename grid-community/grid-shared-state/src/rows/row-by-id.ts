import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowById = <D, E>(api: ApiEnterprise<D, E> | ApiCommunity<D, E>, id: string) => {
  return api.getState().internal.rowBackingDataSource.peek().rowById(id);
};
