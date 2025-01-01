import type { RowSections } from "@1771technologies/grid-types/community";
import { rowIndexForSection } from "@1771technologies/grid-core";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowDepth = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  i: number,
  section: RowSections = "flat",
) => {
  const s = api.getState();
  const index = rowIndexForSection(
    i,
    section,
    s.internal.rowTopCount.peek(),
    s.internal.rowBottomCount.peek(),
    s.internal.rowCount.peek(),
  );

  return s.internal.rowBackingDataSource.peek().rowDepth(index);
};
