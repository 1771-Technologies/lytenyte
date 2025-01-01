import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowDetailVisibleHeight = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  id: string,
) => {
  if (!api.rowDetailRowPredicate(id) || !api.rowDetailIsExpanded(id)) return 0;

  const s = api.getState();
  const detailHeight = s.rowDetailHeight.peek();

  const cache = s.internal.rowDetailAutoHeightCache;
  const estimate = s.rowDetailAutoHeightEstimate.peek();
  if (typeof detailHeight === "number") return detailHeight;
  if (detailHeight === "auto") return cache[id] ?? estimate;

  const row = api.rowById(id)!;
  return detailHeight({ api: api as any, row });
};
