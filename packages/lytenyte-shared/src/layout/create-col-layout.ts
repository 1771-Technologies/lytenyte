import type { ColumnView } from "../columns/index.js";
import type { LayoutHeader, LayoutHeaderCell, LayoutHeaderFloating } from "./types.js";

export function createColumnLayout(view: ColumnView, floatingRowEnabled: boolean) {
  const combinedView = view.combinedView;
  const groupMeta = view.meta;
  const centerEnd = view.startCount + view.centerCount;

  const layout: LayoutHeader[][] = [];

  const floatingRow: LayoutHeaderFloating[] = [];
  for (let r = 0; r < combinedView.length; r++) {
    const row = combinedView[r];

    const rowLayout: LayoutHeader[] = [];
    for (let i = 0; i < row.length; i++) {
      const c = row[i];

      const colS = c.colStart;
      const colPin = colS < view.startCount ? "start" : colS >= centerEnd ? "end" : null;

      if (c.kind === "leaf") {
        const vals: Omit<LayoutHeaderCell, "kind"> = {
          id: c.data.id,
          type: c.data.type ?? "string",
          colPin,
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
        isCollapsible: groupMeta.groupIsCollapsible.get(c.data.idOccurrence)!,
        idOccurrence: c.data.idOccurrence,
        rowStart: c.rowStart,
        rowEnd: c.rowStart + c.rowSpan,
        rowSpan: c.rowSpan,
        colStart: c.colStart,
        colEnd: c.colStart + c.colSpan,
        colSpan: c.colSpan,
        columnIds: view.visibleColumns.slice(c.colStart, c.colStart + c.colSpan).map((x) => x.id),
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
