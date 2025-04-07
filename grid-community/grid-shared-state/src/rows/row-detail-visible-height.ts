import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowDetailVisibleHeight = <D, E>(api: ApiPro<D, E> | ApiCore<D, E>, id: string) => {
  if (!api.rowDetailRowPredicate(id) || !api.rowDetailIsExpanded(id)) return 0;

  const s = api.getState();
  const detailHeight = s.rowDetailHeight.peek();

  if (typeof detailHeight === "number") return detailHeight;

  const row = api.rowById(id)!;
  return detailHeight({ api: api as any, row });
};
