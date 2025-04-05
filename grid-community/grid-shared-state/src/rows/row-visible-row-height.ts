import type { RowSections } from "@1771technologies/grid-types/core";
import { rowIndexForSection } from "@1771technologies/grid-core";
import { sizeFromCoord } from "@1771technologies/js-utils";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowVisibleRowHeight = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
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

  const row = api.rowByIndex(index);
  if (!row) return 0;

  const detailHeight = api.rowDetailVisibleHeight(row.id);

  return sizeFromCoord(index, s.internal.rowPositions.peek()) - detailHeight;
};
