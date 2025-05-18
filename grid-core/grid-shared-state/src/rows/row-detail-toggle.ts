import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowDetailToggle = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  id: string,
  state?: boolean,
) => {
  const row = api.rowById(id);
  if (!row) return;

  const isExpanded = api.rowDetailIsExpanded(id);
  const v = state != null ? state : !isExpanded;

  if (v === isExpanded) return;

  const s = api.getState();
  const c = s.rowDetailExpansions.peek();
  const next = new Set(c);
  if (v) next.add(id);
  else next.delete(id);

  s.rowDetailExpansions.set(next);
  (api as any).eventFire("onRowDetailExpansionsChange", api);

  api.rowRefresh();
};
