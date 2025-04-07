import type { ApiPro, CellSelectionRectPro } from "@1771technologies/grid-types/pro";

export function isBottomRect<D, E>(api: ApiPro<D, E>, rect: CellSelectionRectPro) {
  const s = api.getState();
  const bottomStart = s.internal.rowCount.peek() - s.internal.rowBottomCount.peek();

  return rect.rowStart >= bottomStart;
}
