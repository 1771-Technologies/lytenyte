import type { SpanLayout } from "@1771technologies/lytenyte-shared";
import type { PositionUnion } from "../../../+types";

interface FocusLayoutCriteria {
  readonly kind: "cell" | "full-width";
  readonly isTop: boolean;
  readonly isBot: boolean;
  readonly isRowCenterBefore: boolean;
  readonly isRowCenterAfter: boolean;
  readonly isStart: boolean;
  readonly isEnd: boolean;
  readonly isColCenterBefore: boolean;
  readonly isColCenterAfter: boolean;
  readonly rowIndex: number;
  readonly colIndex: number;
}

const NOT_FOCUSED: FocusLayoutCriteria = {
  kind: "cell",
  isTop: false,
  isBot: false,
  isColCenterBefore: false,
  isColCenterAfter: false,
  isEnd: false,
  isStart: false,
  isRowCenterAfter: false,
  isRowCenterBefore: false,
  rowIndex: -1,
  colIndex: -1,
};

export function getFocusCriteria(n: SpanLayout, f: PositionUnion | null): FocusLayoutCriteria {
  if (!f || (f.kind !== "full-width" && f.kind !== "cell")) {
    return NOT_FOCUSED;
  }

  if (f.kind === "full-width") {
    const isTop = f.rowIndex < n.rowTopEnd;
    const isBot = f.rowIndex >= n.rowBotStart;
    const isRowCenterBefore = f.rowIndex >= n.rowTopEnd && f.rowIndex < n.rowCenterStart;
    const isRowCenterAfter = f.rowIndex >= n.rowCenterEnd && f.rowIndex < n.rowCenterLast;

    return {
      kind: "full-width",
      isTop,
      isBot,
      isRowCenterBefore,
      isRowCenterAfter,
      isColCenterAfter: false,
      isColCenterBefore: false,
      isEnd: false,
      isStart: false,
      rowIndex: f.rowIndex,
      colIndex: f.rowIndex,
    };
  }
  const rowIndex = f.root?.rowIndex ?? f.rowIndex;
  const colIndex = f.root?.colIndex ?? f.colIndex;

  const isTop = rowIndex < n.rowTopEnd;
  const isBot = rowIndex >= n.rowBotStart;
  const isRowCenterBefore = rowIndex >= n.rowTopEnd && rowIndex < n.rowCenterStart;
  const isRowCenterAfter = rowIndex >= n.rowCenterEnd && rowIndex < n.rowCenterLast;

  const isStart = colIndex < n.colStartEnd;
  const isEnd = colIndex >= n.colEndStart;
  const isColCenterAfter = colIndex >= n.colCenterEnd && colIndex < n.colCenterLast;
  const isColCenterBefore = colIndex >= n.colStartEnd && colIndex < n.colCenterStart;

  return {
    kind: "cell",
    isTop,
    isBot,
    isRowCenterAfter,
    isRowCenterBefore,
    isStart,
    isEnd,
    isColCenterAfter,
    isColCenterBefore,
    rowIndex: f.rowIndex,
    colIndex: f.colIndex,
  };
}
