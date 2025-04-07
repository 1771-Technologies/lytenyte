import type { ApiPro } from "@1771technologies/grid-types/pro";

export function isCenterColRect<D, E>(
  api: ApiPro<D, E>,
  rect: { columnStart: number; columnEnd: number },
) {
  const s = api.getState();
  return (
    rect.columnStart >= s.columnVisibleStartCount.peek() &&
    rect.columnStart < s.columnVisibleCenterCount.peek() + s.columnVisibleStartCount.peek()
  );
}
