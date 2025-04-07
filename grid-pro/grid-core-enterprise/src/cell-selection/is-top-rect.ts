import type { ApiPro, CellSelectionRectPro } from "@1771technologies/grid-types/pro";

export function isTopRect<D, E>(api: ApiPro<D, E>, rect: CellSelectionRectPro) {
  const topCount = api.getState().internal.rowTopCount.peek();

  return rect.rowStart < topCount;
}
