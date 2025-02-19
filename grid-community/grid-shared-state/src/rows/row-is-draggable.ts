import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowIsDraggable = <D, E>(api: ApiEnterprise<D, E> | ApiCommunity<D, E>, id: string) => {
  const s = api.getState();
  if (!s.rowDragEnabled.peek()) return false;

  const row = api.rowById(id);

  if (!row) return false;

  const predicate = s.rowDragPredicate.peek();
  if (!predicate) return true;

  return predicate({ api: api as any, row });
};
