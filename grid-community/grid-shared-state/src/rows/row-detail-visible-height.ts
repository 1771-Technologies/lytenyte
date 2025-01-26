import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowDetailVisibleHeight = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  id: string,
) => {
  if (!api.rowDetailRowPredicate(id) || !api.rowDetailIsExpanded(id)) return 0;

  const s = api.getState();
  const detailHeight = s.rowDetailHeight.peek();

  if (typeof detailHeight === "number") return detailHeight;

  const row = api.rowById(id)!;
  return detailHeight({ api: api as any, row });
};
