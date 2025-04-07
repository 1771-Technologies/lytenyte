import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowById = <D, E>(api: ApiPro<D, E> | ApiCore<D, E>, id: string) => {
  return api.getState().internal.rowBackingDataSource.peek().rowById(id);
};
