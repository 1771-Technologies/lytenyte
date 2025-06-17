import type { PathTableItem } from "@1771technologies/lytenyte-path";
import type { Column, ColumnGroupMeta, HeaderLayoutCell } from "../../+types";
import type { SpanLayout } from "@1771technologies/lytenyte-shared";

export function makeColumnLayout(
  combinedView: PathTableItem<Column>[][],
  groupMeta: ColumnGroupMeta,
  b: SpanLayout,
) {
  const layout: HeaderLayoutCell[][] = [];
  for (let r = 0; r < combinedView.length; r++) {
    const row = combinedView[r];

    const rowLayout: HeaderLayoutCell[] = [];
    for (let col = 0; col < row.length; col++) {
      if (
        !(col >= b.colStartStart && col < b.colStartEnd) && // not in start area
        !(col >= b.colCenterStart && col < b.colCenterEnd) && // not in center area
        !(col >= b.colEndStart && col < b.colEndEnd) // not in end area
      ) {
        continue;
      }

      const c = row[col];

      if (c.kind === "leaf") {
        rowLayout.push({
          kind: "cell",
          column: c.data,
          rowStart: c.rowStart,
          rowEnd: c.rowStart + c.rowSpan,
          rowSpan: c.rowSpan,
          colStart: c.colStart,
          colEnd: c.colStart + c.colSpan,
          colSpan: c.colSpan,
        });
        continue;
      }

      rowLayout.push({
        kind: "group",
        id: c.data.id,
        isCollapsible: groupMeta.groupIsCollapsible.get(c.data.id)!,
        idOccurrence: c.data.idOccurrence,
        rowStart: c.rowStart,
        rowEnd: c.rowStart + c.rowSpan,
        rowSpan: c.rowSpan,
        colStart: c.colStart,
        colEnd: c.colStart + c.colSpan,
        colSpan: c.colSpan,
        columnIds: [...c.data.idsInNode],
        groupPath: c.data.groupPath,
        start: c.data.start,
        end: c.data.end,
      });
    }

    layout.push(rowLayout);
  }

  return layout;
}
