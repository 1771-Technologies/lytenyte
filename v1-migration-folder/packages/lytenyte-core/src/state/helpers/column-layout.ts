import type { PathTableItem, SpanLayout } from "@1771technologies/lytenyte-shared";
import type {
  Column,
  ColumnGroupMeta,
  HeaderCellFloating,
  HeaderCellLayout,
  HeaderLayoutCell,
  PositionUnion,
} from "../../+types";
import { rangesOverlap } from "@1771technologies/lytenyte-js-utils";

export function makeColumnLayout<T>(
  combinedView: PathTableItem<Column<T>>[][],
  groupMeta: ColumnGroupMeta,
  b: SpanLayout,
  focus: PositionUnion | null,
  floatingRowEnabled: boolean,
) {
  const layout: HeaderLayoutCell<T>[][] = [];

  const floatingRow: HeaderCellFloating<T>[] = [];
  for (let r = 0; r < combinedView.length; r++) {
    const row = combinedView[r];

    const rowLayout: HeaderLayoutCell<T>[] = [];
    for (let i = 0; i < row.length; i++) {
      const c = row[i];

      const colS = c.colStart;
      const colE = c.colStart + c.colSpan;

      if (
        !rangesOverlap(colS, colE, b.colStartStart, b.colStartEnd) && // not in start area
        !rangesOverlap(colS, colE, b.colCenterStart, b.colCenterEnd) && // not in center area
        !rangesOverlap(colS, colE, b.colEndStart, b.colEndEnd) && // not in end area
        !(focus && rangesOverlap(colS, colE, focus.colIndex, focus.colIndex + 1)) // not if a cell in the column is focused
      ) {
        continue;
      }

      const colPin = colS < b.colStartEnd ? "start" : colS >= b.colEndStart ? "end" : null;

      if (c.kind === "leaf") {
        const vals: Omit<HeaderCellLayout<T>, "kind"> = {
          colPin,
          column: c.data,
          rowStart: c.rowStart,
          rowEnd: c.rowStart + c.rowSpan,
          rowSpan: c.rowSpan,
          colStart: c.colStart,
          colEnd: c.colStart + c.colSpan,
          colSpan: c.colSpan,
          colFirstEndPin: c.colStart === b.colCenterLast ? true : undefined,
          colLastStartPin: c.colStart + c.colSpan === b.colStartEnd ? true : undefined,
        };
        rowLayout.push({ kind: "cell", ...vals });

        if (floatingRowEnabled) {
          floatingRow.push({ kind: "floating", ...vals });
        }

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
        colFirstEndPin: c.colStart === b.colCenterLast ? true : undefined,
        colLastStartPin: c.colStart + c.colSpan === b.colStartEnd ? true : undefined,
      });
    }

    layout.push(rowLayout);
  }

  if (floatingRowEnabled) layout.push(floatingRow);

  return layout;
}
