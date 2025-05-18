import type { ApiPro } from "@1771technologies/grid-types/pro";

export function isEndRect<D, E>(
  api: ApiPro<D, E>,
  rect: { columnStart: number; columnEnd: number },
) {
  const s = api.getState();
  return rect.columnStart >= s.columnVisibleStartCount.peek() + s.columnVisibleCenterCount.peek();
}
