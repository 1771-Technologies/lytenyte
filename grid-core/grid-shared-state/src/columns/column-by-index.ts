import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const columnByIndex = <D, E>(api: ApiPro<D, E> | ApiCore<D, E>, index: number) => {
  const vis = api.getState().columnsVisible.peek();
  return vis[index];
};
