import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const columnByIndex = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  index: number,
) => {
  const vis = api.getState().columnsVisible.peek();
  return vis[index];
};
