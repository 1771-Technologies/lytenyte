import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { CellSelectionRect } from "@1771technologies/grid-types/pro";

export function isBottomRect<D, E>(api: ApiEnterprise<D, E>, rect: CellSelectionRect) {
  const s = api.getState();
  const bottomStart = s.internal.rowCount.peek() - s.internal.rowBottomCount.peek();

  return rect.rowStart >= bottomStart;
}
