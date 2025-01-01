import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowDetailIsExpanded = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  id: string,
) => {
  const s = api.getState();

  return api.rowDetailRowPredicate(id) && s.rowDetailExpansions.peek().has(id);
};
