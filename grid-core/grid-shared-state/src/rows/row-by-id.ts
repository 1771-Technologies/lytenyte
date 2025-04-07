import type { ApiCore, RowNodeCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowById = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  id: string,
): RowNodeCore<D> | null | undefined => {
  return api.getState().internal.rowBackingDataSource.peek().rowById(id);
};
