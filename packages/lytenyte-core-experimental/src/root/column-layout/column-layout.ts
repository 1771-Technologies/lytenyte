import type { HeaderCellFloating, HeaderCellLayout, HeaderLayoutCell } from "../../types/layout.js";
import type { MakeColumnViewReturn } from "../column-view/column-view.js";

export function makeColumnLayout<T>(view: MakeColumnViewReturn<T>, floatingRowEnabled: boolean) {
  const combinedView = view.combinedView;
  const groupMeta = view.meta;
  const centerEnd = view.startCount + view.centerCount;

  const layout: HeaderLayoutCell<T>[][] = [];

  const floatingRow: HeaderCellFloating<T>[] = [];
  for (let r = 0; r < combinedView.length; r++) {
    const row = combinedView[r];

    const rowLayout: HeaderLayoutCell<T>[] = [];
    for (let i = 0; i < row.length; i++) {
      const c = row[i];

      const colS = c.colStart;
      const colPin = colS < view.startCount ? "start" : colS >= centerEnd ? "end" : null;

      if (c.kind === "leaf") {
        const vals: Omit<HeaderCellLayout<T>, "kind"> = {
          id: c.data.id,
          colPin,
          column: c.data,
          rowStart: c.rowStart,
          rowEnd: c.rowStart + c.rowSpan,
          rowSpan: c.rowSpan,
          colStart: c.colStart,
          colEnd: c.colStart + c.colSpan,
          colSpan: c.colSpan,
          colFirstEndPin: c.colStart === centerEnd ? true : undefined,
          colLastStartPin: c.colStart + c.colSpan === view.startCount ? true : undefined,
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
        colFirstEndPin: c.colStart === centerEnd ? true : undefined,
        colLastStartPin: c.colStart + c.colSpan === view.startCount ? true : undefined,
      });
    }

    layout.push(rowLayout);
  }

  if (floatingRowEnabled) layout.push(floatingRow);

  return layout;
}
