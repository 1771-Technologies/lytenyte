import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowDetailIsExpanded = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, id: string) => {
  const s = api.getState();

  return api.rowDetailRowPredicate(id) && s.rowDetailExpansions.peek().has(id);
};
