import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowDetailRowPredicate = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  id: string,
) => {
  const s = api.getState();

  const row = api.rowById(id);
  if (!row) return false;

  const predicate = s.rowDetailPredicate.peek();
  return typeof predicate === "boolean"
    ? predicate && api.rowIsLeaf(row)
    : predicate === "all"
      ? true
      : predicate({ api: api as any, row });
};
