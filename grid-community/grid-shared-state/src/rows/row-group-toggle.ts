import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { RowNodeGroup } from "@1771technologies/grid-types/community";

export const rowGroupToggle = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  row: RowNodeGroup,
  state?: boolean,
) => {
  const s = api.getState();

  const backing = s.internal.rowBackingDataSource.peek();

  const next = state ?? !row.expanded;

  backing.rowGroupToggle(row.id, next);

  api.rowRefresh();
};
