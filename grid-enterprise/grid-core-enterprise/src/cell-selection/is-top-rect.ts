import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { CellSelectionRect } from "@1771technologies/grid-types/pro";

export function isTopRect<D, E>(api: ApiEnterprise<D, E>, rect: CellSelectionRect) {
  const topCount = api.getState().internal.rowTopCount.peek();

  return rect.rowStart < topCount;
}
