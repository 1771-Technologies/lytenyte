import type { ApiEnterprise } from "@1771technologies/grid-types";

export function isCenterColRect<D, E>(
  api: ApiEnterprise<D, E>,
  rect: { columnStart: number; columnEnd: number },
) {
  const s = api.getState();
  return (
    rect.columnStart >= s.columnVisibleStartCount.peek() &&
    rect.columnStart < s.columnVisibleCenterCount.peek() + s.columnVisibleStartCount.peek()
  );
}
