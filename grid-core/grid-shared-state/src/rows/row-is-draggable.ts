import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowIsDraggable = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, id: string) => {
  const s = api.getState();
  if (!s.rowDragEnabled.peek()) return false;

  const row = api.rowById(id);

  if (!row) return false;

  const predicate = s.rowDragPredicate.peek();
  if (!predicate) return true;

  return predicate({ api: api as any, row });
};
