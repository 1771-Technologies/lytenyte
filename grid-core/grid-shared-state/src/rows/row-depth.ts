import { rowIndexForSection } from "@1771technologies/grid-core";
import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro, RowSectionsPro } from "@1771technologies/grid-types/pro";

export const rowDepth = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  i: number,
  section: RowSectionsPro = "flat",
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
