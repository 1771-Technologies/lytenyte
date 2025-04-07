import { isWithinSelectionRect } from "@1771technologies/grid-core-pro";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const cellIsSelected = <D, E>(api: ApiPro<D, E>, r: number, c: number) => {
  const s = api.getState();

  for (const range of s.cellSelections.peek()) {
    if (isWithinSelectionRect(range, r, c)) return true;
  }

  return false;
};
