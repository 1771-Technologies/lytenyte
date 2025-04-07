import type { ApiCore, CellEditLocationCore } from "@1771technologies/grid-types/core";
import { cellEditKey } from "./cell-edit-key";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const cellEditValue = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, p: CellEditLocationCore) => {
  const key = cellEditKey(p);
  const activeValues = api.getState().internal.cellEditActiveEditValues.peek();

  return activeValues.get(key);
};
