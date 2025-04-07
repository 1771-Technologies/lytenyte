import { rowIndexForSection } from "@1771technologies/grid-core";
import type { ApiCore, RowSectionsCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";
import { sizeFromCoord } from "@1771technologies/js-utils";

export const rowVisibleRowHeight = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
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

  const row = api.rowByIndex(index);
  if (!row) return 0;

  const detailHeight = api.rowDetailVisibleHeight(row.id);

  return sizeFromCoord(index, s.internal.rowPositions.peek()) - detailHeight;
};
