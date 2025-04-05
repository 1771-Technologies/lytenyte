import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { RowNodeGroup } from "@1771technologies/grid-types/core";

export const rowGroupToggle = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  row: RowNodeGroup,
  state?: boolean,
) => {
  const s = api.getState();

  const expansions = s.rowGroupExpansions;

  const next = state ?? !api.rowGroupIsExpanded(row);
  expansions.set((prev) => ({ ...prev, [row.id]: next }));

  queueMicrotask(api.rowRefresh);
};
