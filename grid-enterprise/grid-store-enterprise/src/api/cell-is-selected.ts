import type { ApiEnterprise } from "@1771technologies/grid-types";
import { isWithinSelectionRect } from "@1771technologies/grid-core-enterprise";

export const cellIsSelected = <D, E>(api: ApiEnterprise<D, E>, r: number, c: number) => {
  const s = api.getState();

  for (const range of s.cellSelections.peek()) {
    if (isWithinSelectionRect(range, r, c)) return true;
  }

  return false;
};
