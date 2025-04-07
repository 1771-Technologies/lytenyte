import { rowIndexForSection } from "@1771technologies/grid-core";
import type { ApiCore, RowSectionsCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowByIndex = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  i: number,
  section: RowSectionsCore = "flat",
) => {
  const s = api.getState();
  const index = rowIndexForSection(
    i,
    section,
    s.internal.rowTopCount.peek(),
    s.internal.rowBottomCount.peek(),
    s.internal.rowCount.peek(),
  );

  return s.internal.rowBackingDataSource.peek().rowByIndex(index);
};
