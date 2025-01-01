import type { CellEditLocation } from "@1771technologies/grid-types/community";
import { cellEditKey } from "./cell-edit-key";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const cellEditValue = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: CellEditLocation,
) => {
  const key = cellEditKey(p);
  const activeValues = api.getState().internal.cellEditActiveEditValues.peek();

  return activeValues.get(key);
};
