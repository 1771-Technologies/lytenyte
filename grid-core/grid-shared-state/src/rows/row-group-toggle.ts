import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro, RowNodeGroupPro } from "@1771technologies/grid-types/pro";

export const rowGroupToggle = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  row: RowNodeGroupPro,
  state?: boolean,
) => {
  const s = api.getState();

  const expansions = s.rowGroupExpansions;

  const next = state ?? !api.rowGroupIsExpanded(row);
  expansions.set((prev) => ({ ...prev, [row.id]: next }));

  queueMicrotask(api.rowRefresh);
};
