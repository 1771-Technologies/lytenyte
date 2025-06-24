import type { PathTableItem } from "@1771technologies/lytenyte-path";
import type { Column, ColumnGroupMeta, HeaderLayoutCell } from "../../+types";
import type { SpanLayout } from "@1771technologies/lytenyte-shared";

export function makeColumnLayout<T>(
  combinedView: PathTableItem<Column<T>>[][],
  groupMeta: ColumnGroupMeta,
  b: SpanLayout,
) {
  const layout: HeaderLayoutCell<T>[][] = [];
  for (let r = 0; r < combinedView.length; r++) {
    const row = combinedView[r];

    const rowLayout: HeaderLayoutCell<T>[] = [];
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      const col = c.colStart;

      if (
        !(col >= b.colStartStart && col < b.colStartEnd) && // not in start area
        !(col >= b.colCenterStart && col < b.colCenterEnd) && // not in center area
        !(col >= b.colEndStart && col < b.colEndEnd) // not in end area
      ) {
        continue;
      }

      const colPin = col < b.colStartEnd ? "start" : col >= b.colEndStart ? "end" : null;

      if (c.kind === "leaf") {
        rowLayout.push({
          kind: "cell",
          colPin,
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
        colPin,
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
