import type { ColumnPin } from "../+types.js";
import type { ColumnView } from "../column-view/index.js";

export function makeColumnLayout(view: ColumnView, floatingRowEnabled: boolean) {
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

export interface LayoutHeaderCell {
  readonly kind: "cell";
  readonly id: string;
  readonly type: string;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly rowSpan: number;
  readonly colStart: number;
  readonly colEnd: number;
  readonly colSpan: number;
  readonly colPin: ColumnPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
}

export interface LayoutHeaderFloating {
  readonly kind: "floating";
  readonly id: string;
  readonly type: string;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly rowSpan: number;
  readonly colStart: number;
  readonly colEnd: number;
  readonly colSpan: number;
  readonly colPin: ColumnPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
}

export interface LayoutHeaderGroup {
  readonly kind: "group";
  readonly id: string;
  readonly idOccurrence: string;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly rowSpan: number;
  readonly colStart: number;
  readonly colEnd: number;
  readonly colSpan: number;
  readonly colPin: ColumnPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
  readonly isCollapsible: boolean;
  readonly groupPath: string[];
  readonly columnIds: string[];
  readonly start: number;
  readonly end: number;
  readonly isHiddenMove?: boolean;
}

export type LayoutHeader = LayoutHeaderCell | LayoutHeaderFloating | LayoutHeaderGroup;
