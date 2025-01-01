import type { ApiEnterprise } from "@1771technologies/grid-types";

export function isStartRect<D, E>(
  api: ApiEnterprise<D, E>,
  rect: { columnStart: number; columnEnd: number },
) {
  const s = api.getState();
  return rect.columnStart < s.columnVisibleStartCount.peek();
}
