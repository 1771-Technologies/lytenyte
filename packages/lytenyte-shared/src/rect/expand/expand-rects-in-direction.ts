import type { ColumnView } from "../../columns/index.js";
import type { PositionGridCell, PositionUnion } from "../../types.js";
import { expandRectsDown } from "./expand-rects-down.js";
import { expandRectsEnd } from "./expand-rects-end.js";
import { expandRectsStart } from "./expand-rects-start.js";
import { expandRectsUp } from "./expand-rects-up.js";
import type { DataRect } from "../types.js";
import { expandRectToFullSpans } from "../expand-rect-to-full-spans.js";

interface ExpandRectsInDirectionArgs {
  readonly scrollIntoView: (params: { row?: number; column?: number }) => void;
  readonly cellRoot: (row: number, column: number) => PositionUnion | null;
  readonly selections: DataRect[];
  readonly direction: "up" | "down" | "start" | "end";
  readonly meta: boolean;
  readonly pos: PositionGridCell;
  readonly rowCount: number;
  readonly view: ColumnView;
  readonly ignoreFirst: boolean;
}

/**
 * Dispatches to the appropriate directional expand function based on
 * `direction`. Returns the updated selections array, or null if no expansion
 * is possible in the given direction.
 */
export function expandRectsInDirection({
  scrollIntoView,
  cellRoot,
  selections,
  direction,
  meta,
  pos,
  rowCount,
  view,
  ignoreFirst,
}: ExpandRectsInDirectionArgs): DataRect[] | null {
  let rect: DataRect[] | null = null;

  if (direction === "up") {
    rect = expandRectsUp(scrollIntoView, cellRoot, selections, meta, pos, rowCount);
  } else if (direction === "down") {
    rect = expandRectsDown(scrollIntoView, cellRoot, selections, meta, pos, rowCount);
  } else if (direction === "start") {
    rect = expandRectsStart(scrollIntoView, cellRoot, selections, meta, pos, ignoreFirst, view);
  } else if (direction === "end") {
    rect = expandRectsEnd(scrollIntoView, cellRoot, selections, meta, pos, view);
  }

  if (rect === null) return null;

  const last = expandRectToFullSpans(rect[rect.length - 1], cellRoot);
  const result = [...rect];
  result[result.length - 1] = last;
  return result;
}
