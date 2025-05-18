import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowDetailRowPredicate = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, id: string) => {
  const s = api.getState();

  const row = api.rowById(id);
  if (!row) return false;

  const predicate = s.rowDetailEnabled.peek();
  return typeof predicate === "boolean"
    ? predicate && api.rowIsLeaf(row)
    : predicate === "all"
      ? true
      : predicate({ api: api as any, row });
};
